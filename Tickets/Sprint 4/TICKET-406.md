### TICKET-406: DB Schema for Style Run Logs 📝

**Description**
Create the `style_runs` table to log every instance of a generation run, including the input, final output, and judge score.

**Requirements**
- Table: `style_runs(id UUID, style_profile_version_id UUID FK, task TEXT, input_json JSONB, output_text TEXT, score NUMERIC, passed BOOLEAN, created_at TIMESTAMPZ)`

**Acceptance Criteria**
- The `style_runs` table is created successfully. 