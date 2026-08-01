import sys
import os

# Ensure root directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Hugging Face ZeroGPU requirement
import spaces

@spaces.GPU
def _zero_gpu_init():
    return "ok"

import gradio as gr
from backend.main import app as fastapi_app

# Create minimal Gradio Blocks to satisfy Hugging Face Space runner
with gr.Blocks(title="Auto Clipper AI") as demo:
    pass

# Mount Gradio onto FastAPI under /gradio path, so FastAPI controls / and serves dist/index.html directly
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")
