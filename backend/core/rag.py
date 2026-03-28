from django.conf import settings


def get_rag_response(meeting_id, question):
    from langchain_ollama import OllamaEmbeddings, OllamaLLM
    from langchain_community.vectorstores import PGVector
    from .models import Meeting

    llm = OllamaLLM(model=settings.OLLAMA_MODEL, base_url=settings.OLLAMA_BASE_URL)

    # Always load structured meeting data (summary, decisions, action items, full transcript)
    meeting_metadata = ""
    full_transcript = ""
    try:
        meeting = Meeting.objects.select_related('summary', 'transcript').get(id=meeting_id)
        parts = []
        if hasattr(meeting, 'summary'):
            s = meeting.summary
            if s.short_summary:
                parts.append(f"MEETING SUMMARY:\n{s.short_summary}")
            if s.decisions:
                decisions_text = "\n".join(f"- {d}" for d in s.decisions)
                parts.append(f"KEY DECISIONS:\n{decisions_text}")
            if s.action_items:
                items_text = "\n".join(
                    f"- {ai['item']} (Owner: {ai.get('owner', 'TBD')})"
                    if isinstance(ai, dict) else f"- {ai}"
                    for ai in s.action_items
                )
                parts.append(f"ACTION ITEMS:\n{items_text}")
            if s.sentiment:
                parts.append(f"OVERALL SENTIMENT: {s.sentiment}")
        if hasattr(meeting, 'transcript') and meeting.transcript.content:
            full_transcript = meeting.transcript.content
        meeting_metadata = "\n\n".join(parts)
    except Exception:
        pass

    # Try to get semantically relevant chunks from pgvector
    transcript_chunks = ""
    try:
        embeddings = OllamaEmbeddings(
            model=settings.OLLAMA_EMBED_MODEL,
            base_url=settings.OLLAMA_BASE_URL
        )
        vectorstore = PGVector(
            embedding_function=embeddings,
            collection_name=f"meeting_{meeting_id}",
            connection_string=settings.PGVECTOR_CONNECTION_STRING,
        )
        docs = vectorstore.similarity_search(question, k=8)
        if docs:
            transcript_chunks = "\n\n".join([doc.page_content for doc in docs])
    except Exception:
        # Fallback: use the full transcript directly if vector search fails
        transcript_chunks = full_transcript

    # Build context: structured data first, then transcript evidence
    context_parts = []
    if meeting_metadata:
        context_parts.append(meeting_metadata)
    if transcript_chunks:
        context_parts.append(f"RELEVANT TRANSCRIPT:\n{transcript_chunks}")
    full_context = "\n\n---\n\n".join(context_parts)

    if not full_context.strip():
        return "I don't have enough information about this meeting yet. Please wait for processing to complete."

    prompt = f"""You are Nexora, an intelligent meeting assistant. Use the meeting data below to answer accurately.

Instructions:
- Answer directly. Do not say "Based on the transcript" or "According to the context".
- Use specific details, names, and facts from the data.
- For action items or decisions questions, list ALL of them from the meeting data.
- If the answer is not in the data, say "I don't have enough information in this meeting to answer that."

Meeting Data:
{full_context}

Question: {question}

Answer:"""

    return llm.invoke(prompt).strip()
