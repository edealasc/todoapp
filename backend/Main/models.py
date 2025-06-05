from django.db import models

class Todo(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ]

    task_name = models.CharField(max_length=255)
    task_description = models.TextField(blank=True)
    task_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    due_date = models.DateField()

    def __str__(self):
        return self.task_name