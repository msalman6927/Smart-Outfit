from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)

    clothes = relationship("ClothingItem", back_populates="owner")

class ClothingItem(Base):
    __tablename__ = "clothes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    category = Column(String)  # e.g., Shirt, Pants, Jacket
    thickness = Column(String) # Thin, Medium, Thick
    min_temp = Column(Float)
    max_temp = Column(Float)

    owner = relationship("User", back_populates="clothes")
