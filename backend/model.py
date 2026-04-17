from textblob import TextBlob

def get_emotion(polarity):
    if polarity > 0.5:
        return "Very Happy 😄"
    elif polarity > 0.1:
        return "Happy 😊"
    elif polarity >= -0.1:
        return "Neutral 😐"
    elif polarity >= -0.5:
        return "Sad 😢"
    else:
        return "Very Angry 😡"

def analyze_emotion_and_polarity(text):
    analysis = TextBlob(text)
    polarity = round(analysis.sentiment.polarity, 2)
    subjectivity = round(analysis.sentiment.subjectivity, 2)

    emotion = get_emotion(polarity)

    return {
        "text": text,
        "polarity": polarity,
        "subjectivity": subjectivity,
        "emotion": emotion
    }