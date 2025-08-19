### TICKET-420: Implement Judge & Auto-Edit Loop ♻️

**Description**
Implement the final gate that automatically applies a targeted rewrite if the judge's score is below a configurable threshold.

**Requirements**
- Logic: If the score is `< 0.85`, apply one more rewrite using the judge's tips.

**Acceptance Criteria**
- A failing output is automatically revised and re-judged. 