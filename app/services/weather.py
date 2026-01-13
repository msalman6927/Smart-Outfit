import requests
import os

def get_weather(lat: float = 40.7128, lon: float = -74.0060): # Default to NYC
    # Using a free weather API or a mock for demonstration
    # In a real app, use OpenWeatherMap API key from environment
    API_KEY = os.getenv("WEATHER_API_KEY")
    
    if API_KEY:
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
            response = requests.get(url)
            data = response.json()
            return {
                "temp": data["main"]["temp"],
                "condition": data["weather"][0]["main"],
                "city": data.get("name", "Unknown")
            }
        except Exception:
            pass

    # Mock data for demonstration if API key is missing or fails
    return {
        "temp": 15.0,
        "condition": "Cloudy",
        "city": "Default City"
    }
