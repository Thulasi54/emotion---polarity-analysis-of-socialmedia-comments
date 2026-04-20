import subprocess
import sys
import os

def install_requirements():
    print("📦 Installing requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "flask", "flask-cors"])
    print("✅ Requirements installed!")

def run_server():
    print("🚀 Starting Emotion & Polarity Analysis Server...")
    print("🌐 Open your browser at: http://localhost:10000")
    print("⛔ Press Ctrl+C to stop the server")
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    from backend.app import app
    app.run(host="0.0.0.0", port=10000, debug=False)

if __name__ == "__main__":
    install_requirements()
    run_server()