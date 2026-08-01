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

# Custom CSS to strip all Gradio paddings/footers and force full-bleed dark theme matching React app
custom_css = """
footer { visibility: hidden !important; display: none !important; }
.gradio-container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; background: #080808 !important; }
#component-0 { padding: 0 !important; margin: 0 !important; }
"""

# Create Gradio Blocks UI that embeds the React SPA web interface cleanly
with gr.Blocks(title="Auto Clipper AI", css=custom_css) as demo:
    gr.HTML("""
        <iframe 
            src="/index.html" 
            style="width: 100%; height: 96vh; border: none; background: #080808;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    """)

# Mount FastAPI app onto Gradio
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

# Launch Gradio server on 0.0.0.0:7860
demo.launch(server_name="0.0.0.0", server_port=7860)
