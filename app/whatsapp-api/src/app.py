import os

from fastapi import FastAPI, Query

from dotenv import load_dotenv, find_dotenv

from modules.wa_client import WAClient

load_dotenv(find_dotenv())

IS_PRODUCTION = os.getenv("PY_ENV") == "production"

app = FastAPI()

client = WAClient(headless=IS_PRODUCTION)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/login/")
def login():
    if client.IS_LOGGED:
        return {"status": "success"}
    qrcode = client.get_qr_code()
    return {"qrCode": qrcode}


@app.get("/is_logged/")
def is_logged():
    logged = client.is_logged()
    return {"isLogged": logged}


@app.get("/send/")
def get_movie(
    phone: str = Query(None, min_length=1, max_length=100),
    text: str = Query(None, min_length=1, max_length=100),
):
    result = client.send_message(phone, text)
    if not result:
        return {"to": phone, "text": text, "status": "failed"}
    
    return {"to": phone, "text": text, "status": "success"}
