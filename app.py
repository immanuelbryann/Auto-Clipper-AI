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

# Export FastAPI app directly as ASGI entrypoint for Hugging Face Spaces
from backend.main import app
