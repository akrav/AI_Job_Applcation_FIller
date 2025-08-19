### TICKET-407: Implement Corpus File Storage 💾

**Description**
Implement the backend service to securely store your uploaded corpus files (DOCX, PDF, TXT) in Supabase storage.

**Requirements**
- Function: `saveUploadedFile(userId, file) → {bytes_url, mime_type, size}`
- Constraints: Validate max size and allowed file types.

**Acceptance Criteria**
- The endpoint can successfully save a file and return a URL. 