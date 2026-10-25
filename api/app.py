from __future__ import annotations

import os
import smtplib
from contextlib import asynccontextmanager
from email.message import EmailMessage
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row

load_dotenv(Path(__file__).with_name(".env"))

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://muscle:muscle@127.0.0.1:5432/muscle_power",
)
SMTP_HOST = os.getenv("SMTP_HOST", "").strip()
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip()
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER).strip()
MAIL_TO = os.getenv("MAIL_TO", SMTP_FROM).strip()
MAX_PDF_BYTES = 5 * 1024 * 1024


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
    allow_origins=os.getenv(
        "FRONTEND_ORIGIN",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173",
    ).split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def mail_ready() -> bool:
    return bool(SMTP_HOST and SMTP_FROM and MAIL_TO)


def send_mail(to: str, subject: str, body: str, pdf: bytes | None = None, filename: str = "plan.pdf") -> None:
    if not mail_ready():
        raise RuntimeError("Email is not configured")
    msg = EmailMessage()
    msg["From"] = SMTP_FROM
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)
    if pdf:
        msg.add_attachment(pdf, maintype="application", subtype="pdf", filename=filename)
    if SMTP_PORT == 465:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
            if SMTP_USER:
                smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(msg)
        return
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
        smtp.starttls()
        if SMTP_USER:
            smtp.login(SMTP_USER, SMTP_PASSWORD)
        smtp.send_message(msg)


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
    return {"ok": postgres, "postgres": postgres, "mail": mail_ready(), "db_error": db_error}


@app.get("/users")
def list_users():
    with connect() as conn:
        rows = conn.execute("SELECT * FROM users ORDER BY id DESC").fetchall()
    return [dict(row) for row in rows]


@app.post("/users")
async def create_user(
    name: str = Form(...),
    phone: str = Form(""),
    email: str = Form(""),
    message: str = Form(""),
    source: str = Form("contact"),
    pdf: UploadFile | None = File(None),
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

    pdf_bytes = None
    filename = "plan.pdf"
    if pdf and pdf.filename:
        pdf_bytes = await pdf.read()
        if len(pdf_bytes) > MAX_PDF_BYTES:
            raise HTTPException(400, "PDF is too large")
        filename = Path(pdf.filename).name or filename

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

    emailed = False
    mail_error = ""
    if mail_ready():
        try:
            gym_body = (
                f"Name: {name}\n"
                f"Phone: {phone or '—'}\n"
                f"Email: {email or '—'}\n"
                f"Source: {source}\n"
                f"Message: {message or '—'}\n"
            )
            send_mail(MAIL_TO, f"Muscle Power · {name} ({source})", gym_body, pdf_bytes, filename)
            if email:
                member_body = (
                    f"Hi {name.split()[0]},\n\n"
                    "Here is your plan from Muscle Power Gym.\n\n"
                    "Muscle Power Gym\nPort Connecting Road, Halishahar, Chattogram\n"
                )
                send_mail(email, "Your plan · Muscle Power Gym", member_body, pdf_bytes, filename)
            emailed = True
        except Exception as exc:
            mail_error = str(exc)

    return {
        "id": row["id"],
        "saved": True,
        "emailed": emailed,
        "mail_error": mail_error,
    }
