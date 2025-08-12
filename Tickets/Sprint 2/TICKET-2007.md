# TICKET-2007: Implement Writing Style Profile Endpoint 📝

## Description
Create a protected endpoint to upload a document, analyze text, and save the resulting profile.

## Requirements
- Endpoint: `POST /api/v1/profile/writing-style`
- Auth required
- multipart/form-data with file upload
- Saves JSON profile to `writing_style_profiles`

## Test Suite Design
- Integration: valid file → 200 and profile saved
- Integration: missing file → 400
- Integration: unauthenticated → 401

## Acceptance Criteria
- Authenticated users can upload and create a profile
- Profile JSON is persisted 