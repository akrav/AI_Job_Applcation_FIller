### Sprint 4: Writing Style Engine & Storage

This sprint's goal is to implement the entire, complex "write-like-me" pipeline. By the end of this sprint, the backend will be able to ingest your corpus, extract a measurable style kernel, and use it to generate highly refined, on-style text via a durable, repeatable process.

-----

**Ticket Name:** DB Schema for Style Profiles 📝
\<br\> **Ticket Number:** TICKET-401
\<br\> **Description:** Create the core database schema for `style_profiles`, which will store a user's writing style configuration. This is the top-level entity that will contain all subsequent style-related data.
\<br\> **Requirements/Other docs:**

  * **Table**: `style_profiles(id UUID, user_id UUID FK, name VARCHAR, status VARCHAR, created_at TIMESTAMPZ, updated_at TIMESTAMPZ, active_version_id UUID FK)`.
    \<br\> **Acceptance Criteria:**
  * The migration script runs cleanly and creates the `style_profiles` table.

-----

**Ticket Name:** DB Schema for Style Artifact Versions 📝
\<br\> **Ticket Number:** TICKET-402
\<br\> **Description:** Create the `style_profile_versions` table to store a historical record of all style kernels, thresholds, and lexicons. This is critical for versioning and rollback.
\<br\> **Requirements/Other docs:**

  * **Table**: `style_profile_versions(id UUID, style_profile_id UUID FK, version INTEGER, kernel_json JSONB, thresholds_json JSONB, created_at TIMESTAMPZ)`.
    \<br\> **Acceptance Criteria:**
  * The migration script creates the `style_profile_versions` table with all specified fields and foreign keys.

-----

**Ticket Name:** DB Schema for Style Documents 📝
\<br\> **Ticket Number:** TICKET-403
\<br\> **Description:** Create the `style_documents` table to store metadata about the raw files you upload (e.g., resumes, cover letters).
\<br\> **Requirements/Other docs:**

  * **Table**: `style_documents(id UUID, style_profile_id UUID FK, file_name VARCHAR, mime_type VARCHAR, bytes_url VARCHAR, text_chars TEXT, created_at TIMESTAMPZ)`.
    \<br\> **Acceptance Criteria:**
  * The `style_documents` table is created successfully.

-----

**Ticket Name:** DB Schema for Style Exemplars 📝
\<br\> **Ticket Number:** TICKET-404
\<br\> **Description:** Create the `style_exemplars` table to store the short, high-signal sentences that will be used for few-shot prompting.
\<br\> **Requirements/Other docs:**

  * **Table**: `style_exemplars(id UUID, style_profile_version_id UUID FK, text TEXT, word_count INTEGER, source_document_id UUID FK, created_at TIMESTAMPZ)`.
    \<br\> **Acceptance Criteria:**
  * The `style_exemplars` table is created successfully.

-----

**Ticket Name:** DB Schema for Style Lexicon 📝
\<br\> **Ticket Number:** TICKET-405
\<br\> **Description:** Create the `style_lexicon` table to store the lists of preferred, banned, and synonym words derived from your corpus.
\<br\> **Requirements/Other docs:**

  * **Table**: `style_lexicon(id UUID, style_profile_version_id UUID FK, preferred_terms JSONB, banned_terms JSONB, synonyms_map JSONB)`.
    \<br\> **Acceptance Criteria:**
  * The `style_lexicon` table is created successfully.

-----

**Ticket Name:** DB Schema for Style Run Logs 📝
\<br\> **Ticket Number:** TICKET-406
\<br\> **Description:** Create the `style_runs` table to log every instance of a generation run, including the input, final output, and judge score.
\<br\> **Requirements/Other docs:**

  * **Table**: `style_runs(id UUID, style_profile_version_id UUID FK, task TEXT, input_json JSONB, output_text TEXT, score NUMERIC, passed BOOLEAN, created_at TIMESTAMPZ)`.
    \<br\> **Acceptance Criteria:**
  * The `style_runs` table is created successfully.

-----

**Ticket Name:** Implement Corpus File Storage 💾
\<br\> **Ticket Number:** TICKET-407
\<br\> **Description:** Implement the backend service to securely store your uploaded corpus files (DOCX, PDF, TXT) in Supabase storage.
\<br\> **Requirements/Other docs:**

  * **Function**: `saveUploadedFile(userId, file) → {bytes_url, mime_type, size}`.
  * **Constraints**: Validate max size and allowed file types.
    \<br\> **Acceptance Criteria:**
  * The endpoint can successfully save a file and return a URL.

-----

**Ticket Name:** Implement Text Extraction from Corpus 📄
\<br\> **Ticket Number:** TICKET-408
\<br\> **Description:** Create a module that can reliably extract plain, clean text from DOCX, PDF, and TXT files.
\<br\> **Requirements/Other docs:**

  * **Module**: Use reliable libraries (`python-docx`, `pdfplumber`).
  * **Logic**: Normalize quotes, dashes, and remove headers/footers.
    \<br\> **Acceptance Criteria:**
  * The module can extract clean text from a variety of sample documents.

-----

**Ticket Name:** Implement Corpus Normalization 🧹
\<br\> **Ticket Number:** TICKET-409
\<br\> **Description:** Create a module to normalize the extracted text by splitting it into logical units (paragraphs, sentences).
\<br\> **Requirements/Other docs:**

  * **Logic**: Split text into sentences and paragraphs.
    \<br\> **Acceptance Criteria:**
  * The module can segment raw text into a structured format.

-----

**Ticket Name:** Implement Corpus De-duplication 🔄
\<br\> **Ticket Number:** TICKET-410
\<br\> **Description:** Implement a module to remove near-identical passages from the corpus to prevent the style model from overfitting.
\<br\> **Requirements/Other docs:**

  * **Logic**: Use a similarity algorithm (e.g., MinHash) to identify and remove redundant text.
    \<br\> **Acceptance Criteria:**
  * The module can successfully reduce duplicate paragraphs from a test corpus.

-----

**Ticket Name:** Implement Style Feature Extraction Engine 📊
\<br\> **Ticket Number:** TICKET-411
\<br\> **Description:** This is the core module that computes all the objective style metrics (sentence length, clause density, punctuation rates, passive voice ratio) from your cleaned corpus.
\<br\> **Requirements/Other docs:**

  * **Logic**: Use NLP libraries like `spacy` to analyze syntax and voice.
    \<br\> **Acceptance Criteria:**
  * The module can generate a `kernel_json` object with the specified metrics.

-----

**Ticket Name:** Implement Lexicon Builder 📝
\<br\> **Ticket Number:** TICKET-412
\<br\> **Description:** Implement the function to build the preferred, banned, and synonym word lists from the corpus.
\<br\> **Requirements/Other docs:**

  * **Logic**: Use TF-IDF to find a list of candidate preferred terms.
    \<br\> **Acceptance Criteria:**
  * The module can generate the `preferred_terms`, `banned_terms`, and `synonyms_map` lists.

-----

**Ticket Name:** Implement Micro-Exemplar Selector ✨
\<br\> **Ticket Number:** TICKET-413
\<br\> **Description:** Create the module that automatically selects 3-6 short, high-signal sentences from the corpus to be used as style exemplars for few-shot prompting.
\<br\> **Requirements/Other docs:**

  * **Logic**: Select sentences that are 20-35 words long and include diverse rhetorical structures.
    \<br\> **Acceptance Criteria:**
  * The module can select and store valid exemplars in the `style_exemplars` table.

-----

**Ticket Name:** Implement Prompt Builder Function 🤖
\<br\> **Ticket Number:** TICKET-414
\<br\> **Description:** Create a single function that composes the final, multi-part prompt for the LLM, including the system instructions, style kernel, few-shot examples, and the specific task.
\<br\> **Requirements/Other docs:**

  * **Function**: `buildPrompt(kernel, lexicon, exemplars, task)`.
    \<br\> **Acceptance Criteria:**
  * The function generates a correctly formatted prompt string.

-----

**Ticket Name:** Implement Content Pass Generator 📜
\<br\> **Ticket Number:** TICKET-415
\<br\> **Description:** Implement the first pass of the two-pass generation process. This module will gather notes and bullet points from the AI without producing any final prose.
\<br\> **Requirements/Other docs:**

  * **Logic**: The module should only return structured, factual notes.
    \<br\> **Acceptance Criteria:**
  * The module successfully returns notes instead of a finished paragraph.

-----

**Ticket Name:** Implement Style Render Pass 🖌️
\<br\> **Ticket Number:** TICKET-416
\<br\> **Description:** Implement the second pass. This module takes the notes from the content pass and converts them into a final paragraph that strictly adheres to the style kernel's rules.
\<br\> **Requirements/Other docs:**

  * **Logic**: Enforce average sentence length, punctuation habits, lexicon, and voice.
    \<br\> **Acceptance Criteria:**
  * The module successfully generates a single paragraph from a set of notes.

-----

**Ticket Name:** Implement Self-Consistency Generator 🤝
\<br\> **Ticket Number:** TICKET-417
\<br\> **Description:** Implement a function that generates multiple (`N=3-5`) style-constrained candidates for a given task and selects the best one using a simple rubric.
\<br\> **Requirements/Other docs:**

  * **Logic**: Generate candidates with slight decoding diversity (e.g., `temperature=0.7`).
    \<br\> **Acceptance Criteria:**
  * The function returns the best candidate from a set of multiple options.

-----

**Ticket Name:** Implement Self-Refine Pass ✨
\<br\> **Ticket Number:** TICKET-418
\<br\> **Description:** Implement the module where the LLM critiques its best-selected candidate against the style kernel and performs a single rewrite.
\<br\> **Requirements/Other docs:**

  * **Logic**: Prompt the LLM to identify specific weaknesses and apply a targeted rewrite.
    \<br\> **Acceptance Criteria:**
  * The refined output demonstrates an improvement over the original version.

-----

**Ticket Name:** Implement LLM-as-a-Judge Rubric ⚖️
\<br\> **Ticket Number:** TICKET-419
\<br\> **Description:** Create the independent LLM-based judge that scores adherence from 0-1 based on the style kernel's constraints.
\<br\> **Requirements/Other docs:**

  * **Criteria**: Sentence length band, passive/impersonal voice, banned terms, preferred terms, punctuation, and tone.
    \<br\> **Acceptance Criteria:**
  * The judge returns a JSON object with a score and per-criterion boolean checks.

-----

**Ticket Name:** Implement Judge & Auto-Edit Loop ♻️
\<br\> **Ticket Number:** TICKET-420
\<br\> **Description:** Implement the final gate that automatically applies a targeted rewrite if the judge's score is below a configurable threshold.
\<br\> **Requirements/Other docs:**

  * **Logic**: If the score is `< 0.85`, apply one more rewrite using the judge's tips.
    \<br\> **Acceptance Criteria:**
  * A failing output is automatically revised and re-judged.

-----

**Ticket Name:** Implement `POST /style/profiles` Endpoint 💡
\<br\> **Ticket Number:** TICKET-421
\<br\> **Description:** Create the API endpoint to create a new style profile and trigger the initial analysis of a corpus.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /style/profiles`.
  * **Logic**: This endpoint will trigger the orchestration of all the analysis modules (`TICKET-407` to `TICKET-413`).
    \<br\> **Acceptance Criteria:**
  * The endpoint successfully creates a new style profile and initiates the analysis.

-----

**Ticket Name:** Implement `POST /style/profiles/:id/generate` Endpoint 🚀
\<br\> **Ticket Number:** TICKET-422
\<br\> **Description:** Create the primary endpoint for generating a styled paragraph. This will orchestrate the entire generation pipeline (`TICKET-414` to `TICKET-420`).
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /style/profiles/:id/generate`.
  * **Logic**: The endpoint will accept a task, run the full generation and refinement process, and return the final text with the judge's score.
    \<br\> **Acceptance Criteria:**
  * The endpoint returns a final paragraph that has passed the judge's score threshold.

-----

**Ticket Name:** Implement `GET /style/profiles/:id/versions` Endpoint 🕰️
\<br\> **Ticket Number:** TICKET-423
\<br\> **Description:** Create the API endpoint to retrieve all available versions of a style profile for a given user.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `GET /style/profiles/:id/versions`.
    \<br\> **Acceptance Criteria:**
  * The endpoint returns a list of all versions of a user's style profile.

-----

**Ticket Name:** Implement `PUT /style/profiles/:id/activate-version` Endpoint ↩️
\<br\> **Ticket Number:** TICKET-424
\<br\> **Description:** Create the API endpoint that allows a user to "roll back" to a previous version of their style profile by setting it as the `active_version_id`.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `PUT /style/profiles/:id/activate-version`.
    \<br\> **Acceptance Criteria:**
  * The endpoint successfully updates the `active_version_id` for a style profile.

-----

**Ticket Name:** UI: Style Profile Settings Page ⚙️
\<br\> **Ticket Number:** TICKET-425
\<br\> **Description:** Build the user interface to view and edit the settings of an active style profile, including the lexicon and thresholds.
\<br\> **Requirements/Other docs:**

  * **Functionality**: The UI should allow a user to edit their banned/preferred terms and tune the numeric thresholds for sentence length.
    \<br\> **Acceptance Criteria:**
  * The UI successfully updates the style profile settings via the API.

-----

**Ticket Name:** UI: Style Preview Widget 🖥️
\<br\> **Ticket Number:** TICKET-426
\<br\> **Description:** Implement the interactive UI widget that allows a user to test the style engine with a sample task and see the final generated output, along with the judge's score.
\<br\> **Requirements/Other docs:**

  * **Functionality**: The widget will have an input box for a task and a display area for the generated text, judge score, and a pass/fail badge.
    \<br\> **Acceptance Criteria:**
  * A user can run a sample generation and see the results instantly.

-----

**Ticket Name:** Implement Observability & Logging 📝
\<br\> **Ticket Number:** TICKET-427
\<br\> **Description:** Add detailed structured logging and metrics to all backend services within this sprint to track `style_runs`, pass rates, and latencies.
\<br\> **Requirements/Other docs:**

  * **Logic**: Log every step of the generation process with a unique `run_id` for debugging.
    \<br\> **Acceptance Criteria:**
  * All key events are logged with structured data.