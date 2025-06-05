For the application of the internship, only the backend was required and I've completely done that, including the optional tasks. I thought I would add a simple frontend to display it's use. 
The backend is built with django rest framework.

# Backend

## Requirements

- Python 3.10+
- Django 5.x
- djangorestframework
- django-cors-headers

## Setup

To set this project up:

1. Install requirements:
  ```sh
   pip install django djangorestframework django-cors-headers
   ```
2. Apply migrations:
 ```sh
   python manage.py migrate
   ```
3. Run the server:
   ```sh
   python manage.py migrate
   ```
## API Endpoints

The API endpoints for this project are:

GET /api/tasks — Return all tasks and returns them in a JSON format
POST /api/tasks — Add a new task
PUT /api/tasks/:id — Mark as completed
DELETE /api/tasks/:id — Delete a task

## CORS

CORS is enabled right now to test out the project.

