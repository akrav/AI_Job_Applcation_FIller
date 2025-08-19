### TICKET-414: Implement Prompt Builder Function 🤖

**Description**
Create a single function that composes the final, multi-part prompt for the LLM, including the system instructions, style kernel, few-shot examples, and the specific task.

**Requirements**
- Function: `buildPrompt(kernel, lexicon, exemplars, task)`

**Acceptance Criteria**
- The function generates a correctly formatted prompt string. 