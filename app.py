import sys
import os

# Ensure root directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Hugging Face ZeroGPU compatibility decorator
try:
    import spaces
    @spaces.GPU
    def _zero_gpu_init():
        pass
except Exception:
    pass

from backend.main import app
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "7860"))
    uvicorn.run(app, host="0.0.0.0", port=port)
