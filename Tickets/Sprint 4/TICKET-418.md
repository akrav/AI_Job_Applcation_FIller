### TICKET-418: Implement Self-Refine Pass ✨

**Description**
Implement the module where the LLM critiques its best-selected candidate against the style kernel and performs a single rewrite.

**Requirements**
- Logic: Prompt the LLM to identify specific weaknesses and apply a targeted rewrite.

**Acceptance Criteria**
- The refined output demonstrates an improvement over the original version. 