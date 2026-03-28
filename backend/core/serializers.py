from rest_framework import serializers
from .models import Meeting, Transcript, Summary, ChatMessage

class TranscriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcript
        fields = ['content', 'timestamped_content']

class SummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = ['short_summary', 'action_items', 'decisions', 'sentiment', 'sentiment_score', 'sentiment_details']

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['role', 'content', 'timestamp']

class MeetingSerializer(serializers.ModelSerializer):
    transcript = TranscriptSerializer(read_only=True)
    summary = SummarySerializer(read_only=True)
    chat_history = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = Meeting
        fields = ['id', 'title', 'audio_file', 'created_at', 'status', 'transcript', 'summary', 'chat_history']
        extra_kwargs = {
            'title': {'required': False}
        }
