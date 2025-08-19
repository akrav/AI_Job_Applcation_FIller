### TICKET-405: DB Schema for Style Lexicon 📝

**Description**
Create the `style_lexicon` table to store the lists of preferred, banned, and synonym words derived from your corpus.

**Requirements**
- Table: `style_lexicon(id UUID, style_profile_version_id UUID FK, preferred_terms JSONB, banned_terms JSONB, synonyms_map JSONB)`

**Acceptance Criteria**
- The `style_lexicon` table is created successfully. 