from django.urls import path
from . import views

urlpatterns = [
    path('', views.tasks_collection, name='task_get_or_create'), 
    path('<int:id>/', views.task_detail, name='task_update_or_delete'), 
]