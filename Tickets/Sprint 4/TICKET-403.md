### TICKET-403: DB Schema for Style Documents 📝

**Description**
Create the `style_documents` table to store metadata about the raw files you upload (e.g., resumes, cover letters).

**Requirements**
- Table: `style_documents(id UUID, style_profile_id UUID FK, file_name VARCHAR, mime_type VARCHAR, bytes_url VARCHAR, text_chars TEXT, created_at TIMESTAMPZ)`

**Acceptance Criteria**
- The `style_documents` table is created successfully. 