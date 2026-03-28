from celery import shared_task
from .models import Meeting, Transcript, Summary
import json

from django.conf import settings


@shared_task
def transcribe_audio(meeting_id):
    """
    Transcribes audio locally with Whisper and analyzes it with Ollama.
    """
    meeting = None
    try:
        meeting = Meeting.objects.get(id=meeting_id)
        meeting.status = 'transcribing'
        meeting.save()

        # 1. Transcribe with faster-whisper (local, no API key needed)
        from faster_whisper import WhisperModel
        print(f"[NEXORA] Transcribing with Whisper: {meeting.audio_file.name}")
        whisper_model = WhisperModel("base", device="cpu", compute_type="int8")
        segments, _ = whisper_model.transcribe(meeting.audio_file.path)
        segments_list = list(segments)  # generator must be consumed once
        full_transcript = " ".join([seg.text for seg in segments_list]).strip()
        timestamped = [{"start": seg.start, "text": seg.text.strip()} for seg in segments_list]

        # 2. Save transcript
        Transcript.objects.update_or_create(
            meeting=meeting,
            defaults={
                'content': full_transcript,
                'timestamped_content': timestamped
            }
        )

        # 3. Analyze with Ollama
        from langchain_ollama import OllamaLLM
        print(f"[NEXORA] Analyzing transcript with Ollama ({settings.OLLAMA_MODEL})...")
        llm = OllamaLLM(model=settings.OLLAMA_MODEL, base_url=settings.OLLAMA_BASE_URL, format="json")

        analysis_prompt = f"""You are a meeting analysis AI. Read the transcript below and return a single JSON object. No markdown, no explanation, only the JSON.

Required JSON structure:
{{
  "summary": "Write 3 full paragraphs summarizing the meeting topics, discussions, and outcomes.",
  "action_items": [
    {{"item": "specific task to be done", "owner": "person or team responsible"}},
    {{"item": "another specific task", "owner": "person or team"}}
  ],
  "decisions": [
    "First concrete decision made in the meeting",
    "Second concrete decision made in the meeting",
    "Third concrete decision made in the meeting"
  ],
  "sentiment": "Positive",
  "sentiment_details": {{
    "sentences": [
      {{"text": "copy an exact sentence from the transcript", "score": 0.9, "sentiment": "Positive"}},
      {{"text": "copy an exact sentence from the transcript", "score": 0.2, "sentiment": "Negative"}},
      {{"text": "copy an exact sentence from the transcript", "score": 0.5, "sentiment": "Neutral"}},
      {{"text": "copy an exact sentence from the transcript", "score": 0.8, "sentiment": "Positive"}},
      {{"text": "copy an exact sentence from the transcript", "score": 0.3, "sentiment": "Negative"}}
    ],
    "conclusion": "Explain the overall emotional tone of the meeting in 2-3 sentences."
  }}
}}

Rules:
- action_items MUST have at least 3 items extracted from the transcript. Look for any tasks, follow-ups, or responsibilities mentioned.
- decisions MUST have at least 3 items. Look for any conclusions, agreements, or choices made.
- sentiment top-level field must be exactly one of: "Positive", "Neutral", "Negative"
- sentences array must have exactly 5 items copied word-for-word from the transcript
- Output ONLY the JSON object. No markdown fences. No extra text before or after.

Transcript:
{full_transcript}
"""
        content = llm.invoke(analysis_prompt).strip()

        # Strip markdown fences if present
        if '```json' in content:
            content = content.split('```json')[1].split('```')[0].strip()
        elif '```' in content:
            content = content.split('```')[1].split('```')[0].strip()

        data = json.loads(content)
        print(f"[NEXORA] Analysis complete for meeting {meeting_id}")

        # 4. Save summary
        final_summary = data.get('summary', '')
        if isinstance(final_summary, list):
            final_summary = '\n\n'.join(final_summary)

        final_sentiment = data.get('sentiment', 'Neutral')

        Summary.objects.update_or_create(
            meeting=meeting,
            defaults={
                'short_summary': final_summary,
                'action_items': data.get('action_items', []),
                'decisions': data.get('decisions', []),
                'sentiment': final_sentiment,
                'sentiment_score': 1.0 if final_sentiment == 'Positive' else (0.0 if final_sentiment == 'Negative' else 0.5),
                'sentiment_details': data.get('sentiment_details', {})
            }
        )

        meeting.status = 'ready'
        meeting.save()
        print(f"[NEXORA] Processing complete for meeting {meeting_id}")

        # 5. Kick off RAG indexing
        chunk_and_embed_transcript.delay(meeting.id)

    except Exception as e:
        if meeting:
            meeting.status = 'error'
            meeting.save()
        print(f"[NEXORA] Error processing meeting {meeting_id}: {str(e)}")
        raise


@shared_task
def chunk_and_embed_transcript(meeting_id):
    """
    Embeds the transcript using Ollama (nomic-embed-text) and stores
    vectors in PostgreSQL via pgvector.
    """
    try:
        meeting = Meeting.objects.get(id=meeting_id)
        transcript = meeting.transcript

        from langchain_ollama import OllamaEmbeddings
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        from langchain_community.vectorstores import PGVector

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_text(transcript.content)

        embeddings = OllamaEmbeddings(
            model=settings.OLLAMA_EMBED_MODEL,
            base_url=settings.OLLAMA_BASE_URL
        )

        PGVector.from_texts(
            texts=chunks,
            embedding=embeddings,
            collection_name=f"meeting_{meeting_id}",
            connection_string=settings.PGVECTOR_CONNECTION_STRING,
            metadatas=[{"meeting_id": str(meeting_id)}] * len(chunks)
        )
        print(f"[NEXORA] RAG indexing complete for meeting {meeting_id}")

    except Exception as e:
        print(f"[NEXORA] RAG indexing error for meeting {meeting_id}: {str(e)}")
        raise


@shared_task
def analyze_meeting(meeting_id):
    pass
