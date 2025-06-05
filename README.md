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
   python manage.py runserver
   ```
## API Endpoints

The API endpoints for this project are:

GET /api/tasks — Return all tasks and returns them in a JSON format

POST /api/tasks — Add a new task

PUT /api/tasks/:id — Mark as completed

DELETE /api/tasks/:id — Delete a task

## Documentation
The task model includes fields for the task name, task description, due date and the task status (Can be pending or complete).


There are two view functions in this project.
1. task_collection - Can accept two methods, GET and POST to get all the tasks or create a new task. It uses data validation for the POST request to check if the title and due date are given, description is an optional field.
2. task_detail Can accept two methods, PUT and DELETE to either mark a task as complete or delete it.


I've implemented filtering of tasks as pending and completed, but since the request is either way being made to the /api/task endpoint to fetch all the tasks, I thought it would be more efficent and effective to filter them out in the frontend instead.

## CORS

CORS is enabled right now to test out the project.

# Frontend
Although optional, running the frontend displays the project more intuitively, and you can do so by setting it up.
To do so,
1. Go to the frontend folder.
2. Install the requirements:
     ```sh
   npm install
   ```
   If an error occurs use:
     ```sh
   npm install --legacy-peer-deps
   ```
3. Run the app
     ```sh
   npm run dev
   ```
4. Make sure the django backend is running at the same time on 127.0.0.1:8000 and the app should work well as they are integrated.

   
