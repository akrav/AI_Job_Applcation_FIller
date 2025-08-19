### TICKET-413: Implement Micro-Exemplar Selector ✨

**Description**
Create the module that automatically selects 3-6 short, high-signal sentences from the corpus to be used as style exemplars for few-shot prompting.

**Requirements**
- Logic: Select sentences that are 20-35 words long and include diverse rhetorical structures.

**Acceptance Criteria**
- The module can select and store valid exemplars in the `style_exemplars` table. 