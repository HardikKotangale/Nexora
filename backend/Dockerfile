FROM python:3.13-slim

WORKDIR /app

# ffmpeg is required by faster-whisper for audio decoding
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

EXPOSE 8000

CMD ["gunicorn", "nexora_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2"]
