import sys
import os

# Ensure root directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Hugging Face ZeroGPU requirement
try:
    import spaces
    @spaces.GPU
    def _zero_gpu_init():
        return "ok"
except Exception:
    pass

import gradio as gr
from backend.main import app as fastapi_app

# Read built dist/index.html to inject directly without nested iframe security blocks
dist_index_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "dist", "index.html"))
index_html_content = ""
if os.path.exists(dist_index_path):
    with open(dist_index_path, "r", encoding="utf-8") as f:
        index_html_content = f.read()

custom_css = """
footer { visibility: hidden !important; display: none !important; }
.gradio-container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; background: #080808 !important; }
#component-0 { padding: 0 !important; margin: 0 !important; }
"""

# Create Gradio Blocks UI that directly renders React SPA DOM tree without iframe
with gr.Blocks(title="Auto Clipper AI", css=custom_css) as demo:
    gr.HTML(index_html_content)

# Mount FastAPI app onto Gradio
app = gr.mount_gradio_app(fastapi_app, demo, path="/")
