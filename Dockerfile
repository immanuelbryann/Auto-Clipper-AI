FROM python:3.11-slim

# Install system dependencies including FFmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user 1000 for Hugging Face Spaces compatibility
RUN useradd -m -u 1000 user
WORKDIR /home/user/app

# Copy and install python dependencies
COPY --chown=user:user backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source code & prebuilt dist
COPY --chown=user:user backend ./backend
COPY --chown=user:user dist ./dist
COPY --chown=user:user app.py ./app.py

USER user

# Hugging Face default port is 7860
ENV PORT=7860
EXPOSE 7860

CMD ["python", "app.py"]
