### **Sprint 4 Overview: Template Management & Semantic Search**

The goal of this sprint is to finalize the core backend services required for the full MVP experience. We will build a flexible template management system that enables users to define their own custom cover letter formats. Additionally, we will implement the backend logic for our "Application Questions" feature, which uses vector embeddings and semantic search to find the most relevant answers from a user's past successful applications.

-----

### **Major Functionality Delivered**

  * **Template Management Schema**: The PostgreSQL tables for `templates` and `template_tokens` will be created to support custom cover letter templates.
  * **Template Management API**: A full set of CRUD (Create, Read, Update, Delete) API endpoints for authenticated users to manage their personal templates.
  * **Vector Embedding Service**: A low-level function that uses an LLM to generate vector embeddings for text, enabling semantic search.
  * **Application Questions Schema**: We'll add a new table, `application_answers`, to store user questions and their corresponding vector embeddings.
  * **Semantic Search API**: A protected endpoint where a user can submit a question, and the backend will find the most relevant previous answers using semantic search.

-----

### **Sprint Tickets**

The tickets are ordered to resolve dependencies, beginning with the new database schema and low-level functions before moving to the high-level API endpoints.

-----

**Ticket Name:** Update Core Database Schema for Templates & Tokens 🎨
\<br\> **Ticket Number:** TICKET-4001
\<br\> **Description:** This ticket involves updating our database with the new tables required for template management. These tables will store the user's templates and the dynamic tokens they've defined within them.
\<br\> **Requirements/Other docs:**

  * **Tables**: The migration script must create the `templates` and `template_tokens` tables.

  * **Field Definitions**:

    ### **`templates`**

    | Field Name | Specification |
    | :--- | :--- |
    | `id` | UUID, Primary Key |
    | `user_id` | UUID, Foreign Key to `users.id` |
    | `name` | VARCHAR, Not Null |
    | `content` | TEXT, Not Null |
    | `created_at` | TIMESTAMPZ, Not Null |
    | `updated_at` | TIMESTAMPZ, Not Null |

    ### **`template_tokens`**

    | Field Name | Specification |
    | :--- | :--- |
    | `id` | UUID, Primary Key |
    | `template_id` | UUID, Foreign Key to `templates.id` |
    | `placeholder` | VARCHAR, Not Null |
    | `data_source` | JSONB, Not Null |
    | `created_at` | TIMESTAMPZ, Not Null |

  * **Row-Level Security (RLS)**: Configure RLS on both tables to ensure a user can only access their own data.
    \<br\> **Test Suite Design:**

  * A **migration test** that confirms both tables are created successfully with all specified columns and constraints.

  * A **schema test** that verifies the foreign key relationship between `template_tokens.template_id` and `templates.id`.

  * A **security test** that confirms the RLS policies are enabled and correctly prevent unauthorized access.
    \<br\> **Acceptance Criteria:**

  * The `templates` and `template_tokens` tables are created with the specified schemas and constraints.

  * RLS is correctly configured on both tables.

-----

**Ticket Name:** Implement Template Management Endpoints (CRUD) 📁
\<br\> **Ticket Number:** TICKET-4002
\<br\> **Description:** This ticket covers the implementation of a full set of CRUD endpoints for managing user templates. These endpoints will use the new `templates` and `template_tokens` tables.
\<br\> **Requirements/Other docs:**

  * **Endpoints**:
      * `POST /api/v1/templates`: Create a new template.
      * `GET /api/v1/templates`: Retrieve all of a user's templates.
      * `GET /api/v1/templates/{id}`: Retrieve a single template by ID.
      * `PUT /api/v1/templates/{id}`: Update an existing template.
      * `DELETE /api/v1/templates/{id}`: Delete a template.
  * **Protection**: All endpoints must be protected with a valid JWT. RLS will ensure users can only modify their own templates.
    \<br\> **Test Suite Design:**
  * An **integration test** suite for each endpoint to cover successful creation, retrieval, updates, and deletion.
  * A **security integration test** for each endpoint to verify that a user cannot access or modify another user's templates.
    \<br\> **Acceptance Criteria:**
  * A user can successfully perform all CRUD operations on their own templates.
  * Attempts to access or modify other users' templates return a `403` or `404` error.

-----

**Ticket Name:** Implement Vector Embedding Generation Function 🧩
\<br\> **Ticket Number:** TICKET-4003
\<br\> **Description:** This ticket covers the implementation of a low-level function that generates vector embeddings for a given text. This function is a prerequisite for our semantic search feature.
\<br\> **Requirements/Other docs:**

  * **Function Signature**: `generateVectorEmbedding(text)`
  * **Logic**:
    1.  Take a string of text as input.
    2.  Use an LLM API (e.g., OpenAI's embedding models) to convert the text into a numerical vector.
    3.  Return the vector as an array of floating-point numbers.
        \<br\> **Test Suite Design:**
  * A **unit test** with a sample string that asserts the function returns a valid array of numbers of the correct dimension.
  * A **unit test** that checks for consistency: sending the same text twice should result in nearly identical vector embeddings.
    \<br\> **Acceptance Criteria:**
  * The function successfully generates a vector embedding for a given text.
  * The output is a correctly formatted array of numbers.

-----

**Ticket Name:** Update Database Schema for Application Questions & Embeddings 💬
\<br\> **Ticket Number:** TICKET-4004
\<br\> **Description:** This ticket involves updating our database to include a table for storing application questions and their vector embeddings. This is the foundation for our semantic search.
\<br\> **Requirements/Other docs:**

  * **Table**: The migration script must create the `application_answers` table.
  * **Field Definitions**:
    ### **`application_answers`**
    | Field Name | Specification |
    | :--- | :--- |
    | `id` | UUID, Primary Key |
    | `user_id` | UUID, Foreign Key to `users.id` |
    | `question_text` | TEXT, Not Null |
    | `answer_text` | TEXT, Not Null |
    | `vector_embedding` | VECTOR(1536), Not Null |
    | `created_at` | TIMESTAMPZ, Not Null |
  * **`pgvector` Integration**: The `VECTOR(1536)` data type must be correctly configured to store the vector embeddings.
  * **Row-Level Security (RLS)**: Configure RLS on this table to ensure a user can only access their own data.
    \<br\> **Test Suite Design:**
  * A **migration test** that confirms the `application_answers` table is created.
  * A **schema test** that verifies the `vector_embedding` column is of the correct type (`VECTOR`).
  * A **security test** that confirms RLS is enabled.
    \<br\> **Acceptance Criteria:**
  * The `application_answers` table is created with the specified schema.
  * The `vector_embedding` column is configured correctly with `pgvector`.

-----

**Ticket Name:** Implement Semantic Search Endpoint 🔎
\<br\> **Ticket Number:** TICKET-4005
\<br\> **Description:** Create the protected API endpoint that allows a user to perform a semantic search on their saved application questions.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /api/v1/search/questions`
  * **Protection**: The endpoint must require a valid JWT.
  * **Request Body**:
    ```json
    {
      "query_text": "string"
    }
    ```
  * **Success Response**: `200 OK` with a JSON array of the top N most semantically similar `application_answers`. The response should include the `question_text` and `answer_text`.
  * **Logic**:
    1.  Use the `user_id` from the JWT.
    2.  Call the `generateVectorEmbedding` function with the `query_text`.
    3.  Use the generated embedding to perform a semantic search in the `application_answers` table using the `pgvector` extension.
    4.  Return the top 3 most similar results.
        \<br\> **Test Suite Design:**
  * An **integration test** for a **successful search** that inserts a few related answers, queries with a similar phrase, and asserts the correct, most-similar answers are returned.
  * An **integration test** with **no matching results** that asserts an empty array is returned.
  * An **integration test** with an **unauthenticated user** that asserts a `401` status.
    \<br\> **Acceptance Criteria:**
  * The endpoint correctly identifies and returns the most relevant answers based on semantic similarity.
  * The search is fast and efficient due to the use of vector embeddings.