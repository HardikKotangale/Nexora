# Nexora — AI-Powered Meeting Companion

Nexora is a fully local, privacy-first meeting intelligence platform. Upload any audio recording and get an automatic transcript, AI-generated summary, action items, key decisions, sentiment analysis, and a conversational RAG assistant — all running on your machine with no cloud APIs or API keys required.

---

## Features

- **Audio Transcription** — Local Whisper (faster-whisper, base model) converts any audio file to text with timestamps
- **AI Meeting Analysis** — Ollama (llama3.2) extracts summary, action items, key decisions, and sentiment
- **Sentiment Analysis** — Per-sentence sentiment breakdown with an overall meeting tone conclusion
- **RAG Chat Assistant** — Ask any question about your meeting; answered using pgvector similarity search + Ollama
- **Timestamped Transcript** — Full transcript with start times displayed in the UI
- **100% Local** — No API keys, no cloud, no data leaves your machine

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Django 5, Django REST Framework |
| Task Queue | Celery + Redis |
| Database | PostgreSQL 16 with pgvector extension |
| Transcription | faster-whisper (Whisper base model, CPU) |
| LLM (Analysis + Chat) | Ollama — llama3.2 (3B) |
| Embeddings (RAG) | Ollama — nomic-embed-text |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
Nexora/
├── backend/
│   ├── core/
│   │   ├── models.py          # Meeting, Transcript, Summary, ChatMessage
│   │   ├── views.py           # REST API viewsets
│   │   ├── serializers.py     # DRF serializers
│   │   ├── tasks.py           # Celery tasks (transcription, analysis, embedding)
│   │   ├── rag.py             # RAG pipeline (pgvector + Ollama)
│   │   └── urls.py            # API routes
│   ├── nexora_backend/
│   │   ├── settings.py        # Django settings (all config via env vars)
│   │   ├── celery.py          # Celery app config
│   │   └── urls.py            # Root URL config
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── components/        # React components (MeetingDetail, ChatPanel, etc.)
│   │   └── utils/api.js       # Axios API client
│   ├── Dockerfile
│   └── .dockerignore
├── media/                     # Uploaded audio files (auto-created at runtime)
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Mac / Windows / Linux)
  - Includes Docker Engine and Docker Compose
  - **Minimum 8 GB RAM** allocated to Docker (llama3.2 requires ~4 GB at runtime)

---

## Setup & Running

### Step 1 — Create your environment file

```bash
cp .env.example .env
```

Open `.env` and set a secret key:

```env
SECRET_KEY=any-long-random-string-here
DEBUG=True
ALLOWED_HOSTS=*
```

That is the **only required change**. No API keys needed.

### Step 2 — Build and start all services

```bash
docker compose up --build
```

This single command will:

1. Build the backend Docker image (Python 3.13 + ffmpeg + all Python dependencies)
2. Build the frontend Docker image (Node 20, React + Vite build)
3. Start **PostgreSQL 16** with pgvector extension
4. Start **Redis** (Celery broker)
5. Start **Ollama**
6. Run `ollama-init` — pulls **llama3.2** (~2 GB) and **nomic-embed-text** (~270 MB) *(first run only)*
7. Run **Django migrations** automatically
8. Start the **Celery worker**
9. Start the **frontend** server

> **First run takes 5–15 minutes** depending on your internet speed (Ollama model downloads). Every subsequent start takes under 30 seconds.

### Step 3 — Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api/ |
| Ollama API | http://localhost:11434 |
| PostgreSQL | localhost:5432 |

---

## How It Works (End-to-End Flow)

```
1. User uploads an audio file via the frontend
            │
            ▼
2. Django saves the file to ./media/ and queues a Celery task
            │
            ▼
3. Celery: faster-whisper transcribes the audio locally
   → produces full text + timestamped segments
            │
            ▼
4. Celery: Ollama (llama3.2) analyzes the transcript
   → produces summary, action items, key decisions, sentiment
            │
            ▼
5. Celery: Ollama (nomic-embed-text) embeds transcript chunks
   → stored in PostgreSQL via pgvector
            │
            ▼
6. Frontend polls /status/ → displays all results when ready
            │
            ▼
7. User asks a question in the Meeting Assistant
   → pgvector similarity search (k=8 chunks)
   → combined with structured meeting data (summary, decisions, action items)
   → Ollama (llama3.2) generates the answer
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/meetings/` | List all meetings |
| `POST` | `/api/meetings/` | Upload audio and create a meeting |
| `GET` | `/api/meetings/{id}/` | Get full meeting detail (transcript, summary, chat) |
| `GET` | `/api/meetings/{id}/status/` | Poll processing status |
| `POST` | `/api/meetings/{id}/chat/` | Send a RAG chat message |
| `POST` | `/api/meetings/{id}/analyze/` | Re-trigger analysis |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | insecure default | Django secret key — **must be changed** |
| `DEBUG` | `True` | Django debug mode |
| `ALLOWED_HOSTS` | `*` | Comma-separated allowed hostnames |
| `OLLAMA_BASE_URL` | `http://ollama:11434` | Auto-set by docker-compose |
| `OLLAMA_MODEL` | `llama3.2` | LLM used for analysis and chat |
| `OLLAMA_EMBED_MODEL` | `nomic-embed-text` | Embedding model for RAG |
| `DB_HOST` | `postgres` | Auto-set by docker-compose |
| `DB_NAME` | `nexora` | PostgreSQL database name |
| `DB_USER` | `postgres` | PostgreSQL user |
| `DB_PASSWORD` | `password` | PostgreSQL password |
| `REDIS_URL` | `redis://redis:6379/0` | Auto-set by docker-compose |
| `PGVECTOR_CONNECTION_STRING` | auto | LangChain pgvector connection string |

---

## Docker Volumes

| Volume | Contents |
|---|---|
| `nexora_postgres_data` | PostgreSQL database (meetings, transcripts, vectors) |
| `nexora_ollama_data` | Downloaded Ollama models (llama3.2, nomic-embed-text) |
| `nexora_whisper_cache` | Downloaded Whisper model weights (~145 MB) |

---

## Useful Commands

### View logs

```bash
# Stream all services
docker compose logs -f

# Stream a specific service
docker compose logs -f celery
docker compose logs -f backend
docker compose logs -f ollama
```

### Restart a service after a code change

```bash
# Backend code is volume-mounted — no rebuild needed for Python changes
docker compose restart backend
docker compose restart celery
```

### Rebuild after changing requirements.txt or Dockerfile

```bash
docker compose up --build backend celery
```

### Open a Django shell

```bash
docker compose exec backend python manage.py shell
```

### Run migrations manually

```bash
docker compose exec backend python manage.py migrate
```

### List installed Ollama models

```bash
docker compose exec ollama ollama list
```

### Pull a different Ollama model

```bash
docker compose exec ollama ollama pull mistral
```

---

## Stopping

```bash
# Stop all containers — data is preserved
docker compose down

# Stop and remove containers + orphaned networks
docker compose down --remove-orphans
```

---

## Deleting Data

### Delete only uploaded audio files

```bash
rm -rf ./media/uploads/
```

### Delete the PostgreSQL database

Wipes all meetings, transcripts, summaries, chat history, and RAG vectors.

```bash
docker compose down
docker volume rm nexora_postgres_data
docker compose up
```

### Delete the Whisper model cache

Forces re-download (~145 MB) on the next transcription.

```bash
docker volume rm nexora_whisper_cache
```

### Delete Ollama models

Forces re-download of llama3.2 (~2 GB) and nomic-embed-text (~270 MB).

```bash
docker volume rm nexora_ollama_data
```

### Full reset — wipe everything

Removes all containers, volumes, uploaded files, and cached models.

```bash
docker compose down -v
rm -rf ./media/
docker compose up --build
```

> After a full reset the first startup will re-download all Ollama models (~2.3 GB total).

---

## Changing the LLM Model

To switch to a different Ollama model (e.g. `mistral`, `llama3.1`, `qwen2.5`):

1. Pull the model:
   ```bash
   docker compose exec ollama ollama pull mistral
   ```

2. Update `.env`:
   ```env
   OLLAMA_MODEL=mistral
   ```

3. Restart backend and celery:
   ```bash
   docker compose restart backend celery
   ```

---

## Troubleshooting

### Meeting stuck in "transcribing" or "error" state

```bash
docker compose logs -f celery
```

Common causes:
- Unsupported audio format — use `.mp3` or `.wav`
- Ollama not ready yet — wait for `ollama-init` to finish
- Missing package — rebuild: `docker compose up --build`

### Meeting Assistant shows an error

RAG indexing may have failed. Check:

```bash
docker compose logs celery | grep "RAG indexing error"
```

The assistant falls back to the full raw transcript automatically, so it will still answer questions even if vector indexing failed.

### Ollama is slow

llama3.2 runs on CPU by default. For GPU acceleration on Linux with NVIDIA, add this to the `ollama` service in `docker-compose.yml`:

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

### Port already in use

Edit the host-side port (left of `:`) in `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"   # backend now accessible at localhost:8001
```
