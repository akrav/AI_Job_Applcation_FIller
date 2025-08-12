# TICKET-2006: Implement NLP Analysis Function 🧠

## Description
Create a low-level function `analyzeWritingStyle(text)` that sends text to an LLM and returns a structured stylistic profile.

## Requirements
- Function Signature: `analyzeWritingStyle(text: string): Promise<Profile>`
- Construct prompt; call external LLM; parse & validate response

## Test Suite Design
- Unit test: long text → returns object with expected keys
- Unit test: short/empty → error or default profile

## Acceptance Criteria
- Returns valid JSON profile for given text
- Handles edge cases gracefully 