### TICKET-404: DB Schema for Style Exemplars 📝

**Description**
Create the `style_exemplars` table to store the short, high-signal sentences that will be used for few-shot prompting.

**Requirements**
- Table: `style_exemplars(id UUID, style_profile_version_id UUID FK, text TEXT, word_count INTEGER, source_document_id UUID FK, created_at TIMESTAMPZ)`

**Acceptance Criteria**
- The `style_exemplars` table is created successfully. 