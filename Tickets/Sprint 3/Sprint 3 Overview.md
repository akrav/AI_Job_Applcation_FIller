### **Sprint 3 Overview: Core AI Functionality & Content Generation**

This sprint's purpose is to build the backend services that enable our AI to generate personalized content. We'll start with the low-level, self-contained web scraping function and then use it as a dependency for our content generation engine. This engine will orchestrate data retrieval from the user's profile, company intelligence from the web, and an external LLM to produce a final, tailored output.

-----

### **Major Functionality Delivered**

  * **Web Scraping Logic**: A robust function to scrape company websites for key information to be used as context for the AI.
  * **Prompt Orchestration Service**: The core function that constructs a detailed, contextual prompt for the LLM using data from the user's `MemoryBank`, `WritingStyleProfile`, and the scraped company data.
  * **Content Generation API**: A protected endpoint where a user can provide a company URL and a job description to trigger the AI to generate a custom cover letter.
  * **Content Storage**: The generated content will be stored in the database, allowing users to review and download it later.
  * **Enhanced RBAC**: We will protect the content generation API, ensuring only authenticated users can access this premium feature.

-----

### **Sprint Tickets**

The tickets are ordered to resolve dependencies, beginning with the low-level functions and culminating in the final API endpoints.

-----

**Ticket Name:** Implement Web Scraping Function 🕸️
\<br\> **Ticket Number:** TICKET-3001
\<br\> **Description:** Create a low-level, reusable function to scrape a given company URL for key information. This function will be a critical building block for the AI's content generation.
\<br\> **Requirements/Other docs:**

  * **Function Signature**: `scrapeCompanyInfo(url)`
  * **Logic**:
    1.  The function should take a URL as input and use a library like `axios` and a web scraping tool like `cheerio` or `puppeteer` to fetch the page content.
    2.  It should specifically target and extract text from key sections like "About Us," "Our Mission," "Careers," and general body text.
    3.  It should return a single string of concatenated text.
    4.  Implement a strict timeout (e.g., 30 seconds) and handle common errors (e.g., page not found, connection timed out).
        \<br\> **Test Suite Design:**
  * A **unit test** for the function with a **valid company URL** that asserts a non-empty string of text is returned.
  * A **unit test** for an **invalid URL** or a page that returns a 404, asserting a specific error is thrown.
  * A **unit test** for a **timeout** scenario, asserting the function fails gracefully after a defined period.
    \<br\> **Acceptance Criteria:**
  * The function successfully extracts text from a given URL.
  * The function gracefully handles errors and timeouts.

-----

**Ticket Name:** Update Core Database Schema for Generated Content 📝
\<br\> **Ticket Number:** TICKET-3002
\<br\> **Description:** This ticket involves updating the existing database with a new table to store generated application content.
\<br\> **Requirements/Other docs:**

  * **Table**: The migration script must create the `generated_applications` table.
  * **Field Definitions**:
    ### **`generated_applications`**
    | Field Name | Specification |
    | :--- | :--- |
    | `id` | UUID, Primary Key |
    | `user_id` | UUID, Foreign Key to `users.id` |
    | `company_url` | VARCHAR, Not Null |
    | `job_description` | TEXT, Not Null |
    | `generated_text` | TEXT, Not Null |
    | `created_at` | TIMESTAMPZ, Not Null |
  * **Row-Level Security (RLS)**: Add an RLS policy that allows a user to only `SELECT` and `DELETE` rows where `user_id` matches their own ID.
  * **Mermaid ERD:** Update the existing ERD to include the new `generated_applications` table.
    ```mermaid
    erDiagram
        users {
            UUID id PK
            ...
        }
        generated_applications {
            UUID id PK
            UUID user_id FK
            VARCHAR company_url
            TEXT job_description
            TEXT generated_text
            TIMESTAMPZ created_at
        }
        users ||--o{ generated_applications : "generated many"
    ```

\<br\> **Test Suite Design:**

  * A **migration test** that confirms the `generated_applications` table is created successfully.
  * A **schema test** that verifies all columns, data types, and foreign key constraints are correct.
  * A **security test** that confirms the RLS policy is correctly applied.
    \<br\> **Acceptance Criteria:**
  * The `generated_applications` table is created in the database with the specified schema.
  * The RLS policy is correctly enabled and functional.

-----

**Ticket Name:** Implement AI Prompt Orchestration Function 🧠
\<br\> **Ticket Number:** TICKET-3003
\<br\> **Description:** Create a low-level function that builds the final, comprehensive prompt for the LLM. This is the core logic that brings all the data together.
\<br\> **Requirements/Other docs:**

  * **Function Signature**: `buildAiPrompt(userData, companyInfo, jobDescription)`
  * **Logic**:
    1.  The function takes the user's `MemoryBank` data, `WritingStyleProfile` data, the scraped company info, and a job description as input.
    2.  It will assemble a single, formatted string (the prompt) that instructs the LLM to generate a personalized cover letter.
    3.  The prompt must include all contextual data (e.g., "Write in this style: ...", "Use this experience: ...", "Mention this about the company: ...").
        \<br\> **Test Suite Design:**
  * A **unit test** with **mock data** for all inputs that asserts the function returns a non-empty string.
  * A **unit test** that verifies the generated prompt string contains specific keywords or phrases from the input data (e.g., the user's name, the company's mission).
    \<br\> **Acceptance Criteria:**
  * The function correctly combines all data sources into a single, well-structured prompt.
  * The prompt is formatted to be easily understood by a large language model.

-----

**Ticket Name:** Implement Content Generation Endpoint ✍️
\<br\> **Ticket Number:** TICKET-3004
\<br\> **Description:** Create the protected API endpoint that orchestrates the entire content generation process. This endpoint will be the main entry point for users to create a new cover letter.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /api/v1/generate/cover-letter`
  * **Protection**: The endpoint must require a valid JWT.
  * **Request Body**:
    ```json
    {
      "company_url": "string",
      "job_description": "string"
    }
    ```
  * **Success Response**: `200 OK` with a JSON body containing the generated text.
  * **Logic**:
    1.  Validate the request body.
    2.  Use the `user_id` from the JWT to fetch the user's `MemoryBank` and `WritingStyleProfile`.
    3.  Call the `scrapeCompanyInfo` function with the provided URL.
    4.  Call the `buildAiPrompt` function with all the collected data.
    5.  Send the final prompt to the external LLM API.
    6.  Save the generated text into the `generated_applications` table.
        \<br\> **Test Suite Design:**
  * An **integration test** for a **successful request** that asserts a `200` status and a non-empty string is returned.
  * An **integration test** with **invalid input** (e.g., bad URL) that asserts a `400` status.
  * An **integration test** with an **unauthenticated user** that asserts a `401` status.
    \<br\> **Acceptance Criteria:**
  * The endpoint successfully generates content using all data sources and returns a response.
  * The generated content is saved to the database.

-----

**Ticket Name:** Implement Content Retrieval Endpoint 📂
\<br\> **Ticket Number:** TICKET-3005
\<br\> **Description:** Create a protected endpoint that allows a logged-in user to retrieve a previously generated cover letter by its ID.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `GET /api/v1/generated-content/{id}`
  * **Protection**: The endpoint must require a valid JWT.
  * **Success Response**: `200 OK` with the full content of the generated cover letter.
  * **Logic**:
    1.  Use the `user_id` from the JWT.
    2.  Query the `generated_applications` table for the record with the matching `id` and `user_id`.
    3.  Return the `generated_text`.
        \<br\> **Test Suite Design:**
  * An **integration test** for a **valid `id`** that asserts a `200` status and the correct text is returned.
  * An **integration test** with an **invalid `id`** that asserts a `404 Not Found` status.
  * An **integration test** where User A attempts to access content belonging to User B, asserting a `403` or `404` status (to test RLS).
    \<br\> **Acceptance Criteria:**
  * A user can retrieve their own generated content by its ID.
  * The RLS policy prevents a user from accessing content belonging to another user.