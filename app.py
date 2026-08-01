import sys
import os

# Ensure root directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import gradio as gr
from backend.main import app as fastapi_app

# Create a lightweight Gradio Blocks wrapper for Hugging Face Spaces compatibility
with gr.Blocks(title="Auto Clipper AI") as demo:
    gr.Markdown("# ✂️ Auto Clipper AI")

# Mount FastAPI app onto Gradio. Hugging Face automatically imports and serves 'app'
app = gr.mount_gradio_app(fastapi_app, demo, path="/")
