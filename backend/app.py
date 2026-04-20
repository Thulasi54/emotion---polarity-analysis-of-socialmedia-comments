from flask_cors import CORS
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder="../frontend", static_url_path="")
CORS(app)

def get_recommendation(emotion):
    return {
        "sadness": {"message": "Relax... let it flow", "music": "https://cdn.pixabay.com/download/audio/2022/03/15/audio_115b9bcd17.mp3"},
        "anger": {"message": "Calm your breath", "music": "https://cdn.pixabay.com/download/audio/2022/10/25/audio_9463e2b2b3.mp3"},
        "fear": {"message": "Stay grounded", "music": "https://cdn.pixabay.com/download/audio/2021/09/06/audio_8d86c8b63f.mp3"},
        "joy": {"message": "Enjoy the moment", "music": "https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8c8a73467.mp3"},
        "gratitude": {"message": "Stay thankful", "music": "https://cdn.pixabay.com/download/audio/2022/02/23/audio_d1718c0f1b.mp3"},
        "surprise": {"message": "Embrace the moment", "music": "https://cdn.pixabay.com/download/audio/2022/03/10/audio_2c0c7fbe76.mp3"}
    }.get(emotion, {"message": "Stay balanced", "music": ""})

@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    emotion = data.get("emotion", "")
    if not emotion:
        t = text.lower()
        if "happy" in t: emotion = "joy"
        elif "angry" in t: emotion = "anger"
        elif "fear" in t: emotion = "fear"
        elif "thank" in t: emotion = "gratitude"
        elif "wow" in t: emotion = "surprise"
        else: emotion = "sadness"
    polarity = "positive" if emotion in ["joy", "gratitude"] else "negative"
    rec = get_recommendation(emotion)
    return jsonify({"emotion": emotion, "polarity": polarity, "message": rec["message"], "music": rec["music"]})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=False)