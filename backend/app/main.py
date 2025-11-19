from fastapi import FastAPI
from database import engine
from settings import get_settings

import models

app = FastAPI()

models.Base.metadata.create_all(engine)
