from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Meeting, ChatMessage
from .serializers import MeetingSerializer, ChatMessageSerializer
import os
from .tasks import transcribe_audio
from .rag import get_rag_response

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all().order_by('-created_at')
    serializer_class = MeetingSerializer

    def perform_create(self, serializer):
        audio_file = self.request.data.get('audio_file')
        title = self.request.data.get('title')
        if not title and audio_file:
            title = os.path.splitext(audio_file.name)[0]
        serializer.save(title=title or "Untitled Meeting")
        
        meeting = serializer.instance
        transcribe_audio.delay(meeting.id)

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        meeting = self.get_object()
        return Response({'status': meeting.status})

    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        from .tasks import analyze_meeting
        meeting = self.get_object()
        analyze_meeting.delay(meeting.id)
        return Response({'status': 'analysis_triggered'})

    @action(detail=True, methods=['post'])
    def chat(self, request, pk=None):
        meeting = self.get_object()
        question = request.data.get('question')
        if not question:
            return Response({'error': 'Question is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        ChatMessage.objects.create(meeting=meeting, role='user', content=question)
        
        try:
            answer = get_rag_response(meeting.id, question)
            ChatMessage.objects.create(meeting=meeting, role='assistant', content=answer)
            return Response({'answer': answer})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
