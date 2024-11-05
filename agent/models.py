from django.db import models
from accounts.models import CustomUser
from professors.models import Document
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

class AgentSubmission(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE)
    is_approved_by_professor = models.BooleanField(default=False)
    approval_token = models.CharField(max_length=100, unique=True)
    submitted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='agent_submissions')
    
    def send_approval_email(self):
        context = {
            'professor_name': self.document.professeur.get_full_name(),
            'agent_name': self.submitted_by.get_full_name(),
            'document_name': self.document.document_file.name,
            'approval_link': f"{settings.BASE_URL}/agent/approve/{self.approval_token}/"
        }
        
        message = render_to_string('agent/email/approval_request.html', context)
        
        send_mail(
            'Document Submission Approval Required',
            message,
            settings.DEFAULT_FROM_EMAIL,
            [self.document.professeur.email],
            html_message=message,
            fail_silently=False,
        )
