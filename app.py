import sys
import os

# Ensure root directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import gradio as gr
from backend.main import app as fastapi_app

# Create a lightweight Gradio Blocks wrapper for Hugging Face Spaces compatibility
with gr.Blocks(title="Auto Clipper AI") as demo:
    gr.Markdown("# ✂️ Auto Clipper AI")

# Mount FastAPI app onto Gradio
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "7860"))
    uvicorn.run(app, host="0.0.0.0", port=port)
