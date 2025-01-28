# Use a Python base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy requirements.txt (assuming it exists in the same directory as your Dockerfile)
COPY dummy_remover/requirements.txt /app/

# Install dependencies
RUN pip install --upgrade pip
RUN pip install virtualenv
RUN virtualenv venv  # Create the virtual environment
RUN . venv/bin/activate && pip install -r requirements.txt  # Install dependencies inside the virtual environment

# Copy the rest of the Flask application
COPY dummy_remover/ /app/

# Expose the port that Flask runs on (default: 5000)
EXPOSE 5000

# Command to run Flask API (replace with your app's entry point)
CMD ["python", "dummyRemovalApi.py"]
