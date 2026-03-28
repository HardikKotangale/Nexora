from django.db import models

class Meeting(models.Model):
    title = models.CharField(max_length=255)
    audio_file = models.FileField(upload_to='uploads/')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='pending') # pending, transcribing, ready, error

    def __str__(self):
        return self.title

class Transcript(models.Model):
    meeting = models.OneToOneField(Meeting, on_delete=models.CASCADE, related_name='transcript')
    content = models.TextField()
    timestamped_content = models.JSONField(null=True, blank=True)

class Summary(models.Model):
    meeting = models.OneToOneField(Meeting, on_delete=models.CASCADE, related_name='summary')
    short_summary = models.TextField()
    action_items = models.JSONField(null=True, blank=True)
    decisions = models.JSONField(null=True, blank=True)
    sentiment = models.CharField(max_length=50, null=True, blank=True) # Positive, Neutral, Negative
    sentiment_score = models.FloatField(null=True, blank=True) # 0.0 to 1.0 logic
    sentiment_details = models.JSONField(null=True, blank=True) # Detailed sentences + reasoning

class ChatMessage(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='chat_history')
    role = models.CharField(max_length=10) # user, assistant
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
