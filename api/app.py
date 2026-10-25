from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row

load_dotenv(Path(__file__).with_name(".env"))

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://muscle:muscle@127.0.0.1:5432/muscle_power",
)


def connect():
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)


def init_db() -> None:
    with connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id BIGSERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT,
                email TEXT,
                message TEXT,
                source TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
            """
        )
        conn.commit()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Muscle Power Gym", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip().rstrip("/")
        for origin in os.getenv(
            "FRONTEND_ORIGIN",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173,https://muscle-power-gym.vercel.app",
        ).split(",")
        if origin.strip()
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    try:
        with connect() as conn:
            conn.execute("SELECT 1")
        postgres = True
        db_error = ""
    except Exception as exc:
        postgres = False
        db_error = str(exc)
    return {"ok": postgres, "postgres": postgres, "db_error": db_error}


@app.get("/users")
def list_users():
    with connect() as conn:
        rows = conn.execute("SELECT * FROM users ORDER BY id DESC").fetchall()
    return [dict(row) for row in rows]


@app.post("/users")
def create_user(
    name: str = Form(...),
    phone: str = Form(""),
    email: str = Form(""),
    message: str = Form(""),
    source: str = Form("contact"),
):
    name = name.strip()
    phone = phone.strip()
    email = email.strip()
    message = message.strip()
    source = source.strip() or "contact"
    if not name:
        raise HTTPException(400, "Name is required")
    if len(name) > 80:
        raise HTTPException(400, "Name is too long")
    if email and "@" not in email:
        raise HTTPException(400, "Email is not valid")
    if len(message) > 2000:
        raise HTTPException(400, "Message is too long")

    try:
        with connect() as conn:
            row = conn.execute(
                """
                INSERT INTO users (name, phone, email, message, source)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
                """,
                (name, phone, email, message, source),
            ).fetchone()
            conn.commit()
    except psycopg.Error as exc:
        raise HTTPException(503, "Database is unavailable") from exc

    return {"id": row["id"], "saved": True}
