### TICKET-419: Implement LLM-as-a-Judge Rubric ⚖️

**Description**
Create the independent LLM-based judge that scores adherence from 0-1 based on the style kernel's constraints.

**Requirements**
- Criteria: Sentence length band, passive/impersonal voice, banned terms, preferred terms, punctuation, and tone.

**Acceptance Criteria**
- The judge returns a JSON object with a score and per-criterion boolean checks. 