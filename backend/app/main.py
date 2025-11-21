"""Main file"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.infra.database.connection import engine
from app.infra.database import models
from app.api.routes import bookings, search

app = FastAPI()


models.Base.metadata.create_all(engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bookings.router, prefix="/api")
app.include_router(search.router, prefix="/api")

@app.get("/health")
def health():
    """Health check"""
    return {"status": "healthy"}
