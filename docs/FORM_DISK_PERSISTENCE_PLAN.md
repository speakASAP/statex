## Form Submission Disk Persistence Plan

Goal: Save ALL submitted information (text, attachments, voice) on disk for every submission via the submission-service without changing frontend APIs.

Scope:

- Service: `statex-website/services/submission-service`
- Persist to: `${HOST_UPLOAD_DIR:-./uploads}/<user_id>/<session_id>/`
  - `form_data.md` – submitted text + metadata
  - `files/<uuid>.<ext>` – attachments
  - `files/<uuid>.<ext>` – voice recording

Implementation:

- Add `storage/disk_storage.py` with helpers:
  - `get_base_dir()` reads `HOST_UPLOAD_DIR` or defaults `./uploads`
  - `generate_user_and_session(user_email, request)` derives stable `user_id`, new `session_id`
  - `ensure_session_dirs(base, user_id, session_id)` creates `<base>/<user_id>/<session_id>/files`
  - `write_form_markdown(path_session, payload)` writes markdown aligned with website backend format
  - `save_upload_file(path_files, upload)` writes raw bytes to disk and returns stored metadata
- Wire into `create_submission` in `main.py` before AI orchestration.
- Extend JSON response with `disk_path`, `user_id`, `session_id`, `saved_files`.

Dev configuration:

- Update `statex-website/docker-compose.dev.yml` (submission-service):
  - env: `HOST_UPLOAD_DIR=/app/data/uploads`
  - volumes: `./services/submission-service/data:/app/data`

Exact Save Location (development default):

- Host path: `statex-website/services/submission-service/data/uploads/<user_id>/<session_id>/`
- In-container: `/app/data/uploads/<user_id>/<session_id>/`

Testing:

- Submit with text only ⇒ `form_data.md` present
- Submit with files ⇒ files appear under `files/`
- Submit with voice ⇒ voice saved under `files/`
