from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.all_models import ClothingItem, User
from .auth import get_current_user
from ..services.weather import get_weather

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("/")
def get_recommendation(
    lat: float = 40.7128, 
    lon: float = -74.0060,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    weather = get_weather(lat, lon)
    temp = weather["temp"]
    
    user_clothes = db.query(ClothingItem).filter(ClothingItem.user_id == current_user.id).all()
    
    recommendations = []
    
    # Simple rule-based logic
    # Filter clothes that match the current temperature
    for item in user_clothes:
        if item.min_temp <= temp <= item.max_temp:
            recommendations.append(item)
            
    # Group by category to pick one of each
    categories = {}
    for item in recommendations:
        if item.category not in categories:
            categories[item.category] = item
            
    return {
        "weather": weather,
        "outfit": list(categories.values())
    }
