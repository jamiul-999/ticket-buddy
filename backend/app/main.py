"""Necessary fastapi and database modules"""
from fastapi import FastAPI
from app.infra.database.connection import engine
from app.infra.database import models

app = FastAPI()

models.Base.metadata.create_all(engine)

@app.get("/health")
def health():
    """Health check"""
    return {"status": "healthy"}
