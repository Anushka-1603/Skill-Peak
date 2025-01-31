# Use Python 3.9 as the base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Upgrade pip
RUN pip install --upgrade pip

# Copy the Django project  and install dependencies
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Copy the Django project
COPY . /app/

# Expose the Django port
EXPOSE 8000

# Run Django’s development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]