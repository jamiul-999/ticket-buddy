"""Main file"""
from fastapi import FastAPI
from app.infra.database.connection import engine
from app.infra.database import models
from app.api.routes import bookings

app = FastAPI()

models.Base.metadata.create_all(engine)

app.include_router(bookings.router, prefix="/api")

@app.get("/health")
def health():
    """Health check"""
    return {"status": "healthy"}
