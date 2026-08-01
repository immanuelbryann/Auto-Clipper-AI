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

# Create a lightweight Gradio Blocks wrapper
with gr.Blocks(title="Auto Clipper AI") as demo:
    gr.Markdown("# ✂️ Auto Clipper AI")

# Mount FastAPI app onto Gradio
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

# Launch Gradio server on 0.0.0.0:7860
demo.launch(server_name="0.0.0.0", server_port=7860)
