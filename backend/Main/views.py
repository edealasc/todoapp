from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Todo

import datetime

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def tasks_collection(request):
    
    # GET /api/tasks — Return all tasks as JSON
    # POST /api/tasks — Add a new task

    if request.method == 'GET':
        tasks = Todo.objects.all()
        tasks_json = [
            {
                "id": task.id,
                "task_name": task.task_name,
                "task_description": task.task_description,
                "task_status": task.task_status,
                "due_date": task.due_date.isoformat(),
            }
            for task in tasks
        ]
        return Response(tasks_json, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        data = request.data
        if not data.get('task_name') or not data.get('due_date'):
            return Response({'detail': 'task_name and due_date are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            task = Todo.objects.create(
                task_name=data['task_name'],
                task_description=data.get('task_description', ''),
                due_date=data['due_date']
            )
            return Response({'id': task.id, 'message': 'Task created'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def task_detail(request, id):
    
    # PUT /api/tasks/:id — Mark as completed
    # DELETE /api/tasks/:id — Delete a task
    
    try:
        task = Todo.objects.get(id=id)
    except Todo.DoesNotExist:
        return Response({'detail': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        task.task_status = 'completed'
        task.save()
        return Response({'message': 'Task marked as completed'}, status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        task.delete()
        return Response({'message': 'Task deleted'}, status=status.HTTP_200_OK)
