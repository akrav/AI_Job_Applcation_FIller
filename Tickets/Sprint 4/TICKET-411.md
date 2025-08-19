### TICKET-411: Implement Style Feature Extraction Engine 📊

**Description**
This is the core module that computes all the objective style metrics (sentence length, clause density, punctuation rates, passive voice ratio) from your cleaned corpus.

**Requirements**
- Logic: Use NLP libraries like `spacy` to analyze syntax and voice.

**Acceptance Criteria**
- The module can generate a `kernel_json` object with the specified metrics. 