import os
import hashlib
import uuid
from datetime import datetime
from pathlib import Path
from typing import Tuple, Dict, Any

from fastapi import UploadFile, Request


def get_base_dir() -> Path:
    base = os.getenv("SUBMISSION_UPLOAD_DIR", "./uploads")
    base_path = Path(base)
    base_path.mkdir(parents=True, exist_ok=True)
    return base_path


def generate_user_and_session(user_email: str, request: Request) -> Tuple[str, str]:
    ip = request.client.host if request and request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown") if request else "unknown"
    seed = f"{user_email}|{ip}|{user_agent}"
    user_id = hashlib.md5(seed.encode()).hexdigest()
    session_id = f"sess_{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex[:8]}"
    return user_id, session_id


def ensure_session_dirs(base_dir: Path, user_id: str, session_id: str) -> Tuple[Path, Path]:
    session_path = base_dir / user_id / session_id
    files_path = session_path / "files"
    files_path.mkdir(parents=True, exist_ok=True)
    return session_path, files_path


def get_tmp_dir() -> Path:
    base = Path(os.getenv("SUBMISSION_TMP_DIR", "/app/data/tmp"))
    base.mkdir(parents=True, exist_ok=True)
    return base


def ensure_tmp_session_dirs(temp_session_id: str) -> Path:
    tmp_base = get_tmp_dir()
    session_tmp = tmp_base / temp_session_id / "files"
    session_tmp.mkdir(parents=True, exist_ok=True)
    return session_tmp


def _form_markdown(payload: Dict[str, Any]) -> str:
    timestamp = datetime.utcnow().isoformat()
    return (
        f"# Form Submission Data\n\n"
        f"**Timestamp:** {timestamp}\n"
        f"**Form Type:** {payload.get('request_type', 'contact')}\n\n"
        f"## Contact Information\n"
        f"- **Name:** {payload.get('user_name') or 'Not provided'}\n"
        f"- **Contact Type:** email\n"
        f"- **Contact Value:** {payload.get('user_email') or 'Not provided'}\n\n"
        f"## Project Description\n"
        f"{payload.get('description') or ''}\n\n"
        f"## Voice Recording\n"
        f"- **Has Recording:** {'Yes' if payload.get('has_voice') else 'No'}\n"
        f"- **Recording Duration:** {payload.get('recording_time', 0)} seconds\n\n"
        f"---\n*Generated automatically by Submission Service*\n"
    )


def write_form_markdown(session_path: Path, payload: Dict[str, Any]) -> None:
    md_path = session_path / "form_data.md"
    md_path.write_text(_form_markdown(payload), encoding="utf-8")


async def save_upload_file(files_path: Path, upload: UploadFile) -> Dict[str, Any]:
    original = upload.filename or "file"
    ext = ''.join(Path(original).suffixes) or ''
    stored_name = f"{uuid.uuid4().hex}{ext}"
    dest = files_path / stored_name

    content = await upload.read()
    dest.write_bytes(content)

    return {
        "original_name": original,
        "stored_name": stored_name,
        "size": len(content),
        "content_type": upload.content_type or "application/octet-stream",
        "path": str(dest)
    }


def move_temp_files_from_metadata(base_dir: Path, user_id: str, session_id: str, files_meta: list[dict] | None, voice_meta: dict | None) -> list[dict]:
    moved: list[dict] = []
    if not files_meta and not voice_meta:
        return moved
    _, final_files = ensure_session_dirs(base_dir, user_id, session_id)

    def _move_one(temp_session_id: str, stored_name: str, kind: str) -> dict | None:
        src = get_tmp_dir() / temp_session_id / "files" / stored_name
        if not src.exists():
            return None
        dst = final_files / stored_name
        dst.parent.mkdir(parents=True, exist_ok=True)
        try:
            dst.write_bytes(src.read_bytes())
            return {"stored_name": stored_name, "path": str(dst), "type": kind}
        except Exception:
            return None

    if files_meta:
        for f in files_meta:
            stored = f.get("fileId") or f.get("stored_name")
            temp_sess = f.get("tempSessionId")
            if stored and temp_sess:
                res = _move_one(temp_sess, stored, "attachment")
                if res:
                    moved.append(res)

    if voice_meta:
        stored = voice_meta.get("fileId") or voice_meta.get("stored_name")
        temp_sess = voice_meta.get("tempSessionId")
        if stored and temp_sess:
            res = _move_one(temp_sess, stored, "voice")
            if res:
                moved.append(res)

    return moved
