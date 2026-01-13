from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, clothes, recommendations

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Weather Outfit Recommendation API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "null", "http://localhost", "http://127.0.0.1"], # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(clothes.router)
app.include_router(recommendations.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Smart Weather Outfit Recommendation API"}
