### **Sprint 2 Overview: Tool Registry & Writing Style Profile**

This sprint's purpose is to empower **Tool Makers** (Merchants) by allowing them to manage their tool listings and to implement the backend logic for our core NLP feature. We will create the necessary database schema for tools and the API endpoints for managing them. Concurrently, we will build the backend logic for processing user documents and generating a writing style profile. This is the first major piece of business logic we'll build.

-----

### **Major Functionality Delivered**

  * **Tool Registry Database Schema**: The initial PostgreSQL tables for `tools` and `merchants` will be updated to handle tool listings.
  * **Tool Management API**: CRUD (Create, Read, Update, Delete) endpoints for `Merchant` users to manage their tool listings.
  * **Document Processing Logic**: A core backend function to handle file uploads and use a large language model (LLM) to perform lexical and stylistic analysis.
  * **Writing Style Profile API**: An endpoint for authenticated users to upload a document, which triggers the analysis and stores the resulting JSON profile in the database.
  * **Role-Based Access Control (RBAC) Enforcement**: We'll begin enforcing RBAC by ensuring only `Merchant` accounts can use the tool management APIs.

-----

### **Sprint Tickets**

The tickets are ordered to resolve dependencies, starting with schema updates and low-level functions before moving to the high-level API endpoints.

-----

**Ticket Name:** Update Core Database Schema for Tools 🛠️
\<br\> **Ticket Number:** TICKET-2001
\<br\> **Description:** This ticket involves updating our existing PostgreSQL database with the new table needed for the Tool Registry. We will also add a `last_updated` field to the `merchants` table.
\<br\> **Requirements/Other docs:**

  * **Table**: The migration script must create the `tools` table.

  * **Field Definitions**:

    ### **`tools`**

    | Field Name | Specification |
    | :--- | :--- |
    | `id` | UUID, Primary Key |
    | `merchant_id` | UUID, Foreign Key to `merchants.user_id` |
    | `name` | VARCHAR, Not Null |
    | `description` | TEXT, Not Null |
    | `pricing_model` | JSONB, Not Null |
    | `api_specification_url` | VARCHAR, Not Null |
    | `is_listed` | BOOLEAN, Default: `true` |
    | `created_at` | TIMESTAMPZ, Not Null |
    | `updated_at` | TIMESTAMPZ, Not Null |

  * **Mermaid ERD:** Update the existing ERD to include the new `tools` table.

    ```mermaid
    erDiagram
        users {
            UUID id PK
            ...
        }
        merchants {
            UUID user_id PK_FK
            DECIMAL trust_rating
            TIMESTAMPZ created_at
        }
        agents {
            UUID user_id PK_FK
            DECIMAL balance
            TIMESTAMPZ created_at
        }
        tools {
            UUID id PK
            UUID merchant_id FK
            VARCHAR name
            TEXT description
            JSONB pricing_model
            VARCHAR api_specification_url
            BOOLEAN is_listed
            TIMESTAMPZ created_at
            TIMESTAMPZ updated_at
        }
        users ||--o{ merchants : "has one"
        users ||--o{ agents : "has one"
        merchants ||--o{ tools : "manages many"
    ```

\<br\> **Test Suite Design:**

  * A **migration test** that confirms the `tools` table is created successfully.
  * A **schema test** that verifies all columns, data types, and foreign key constraints are correct.
    \<br\> **Acceptance Criteria:**
  * The `tools` table is created in the database with the specified schema.
  * The `merchant_id` field is a foreign key linked to `merchants.user_id`.

-----

**Ticket Name:** Implement a Generic RBAC Middleware 🛡️
\<br\> **Ticket Number:** TICKET-2002
\<br\> **Description:** Create a reusable middleware function that can be applied to any Express.js route to restrict access based on a user's role. This middleware will be used for all subsequent protected endpoints.
\<br\> **Requirements/Other docs:**

  * **Middleware Function**: `rbacMiddleware(allowedRoles)`
  * **Logic**:
    1.  The function should take an array of strings (e.g., `['MERCHANT', 'ADMIN']`) as input.
    2.  It will extract the JWT from the request header and decode it.
    3.  It will use the decoded `user_id` to look up the user's `account_type` from the `users` table.
    4.  If the user's role is in the `allowedRoles` array, it calls `next()`.
    5.  If not, it returns a `403 Forbidden` error.
        \<br\> **Test Suite Design:**
  * A **unit test** for the middleware where a user with an **allowed role** accesses a protected route, asserting that `next()` is called.
  * A **unit test** where a user with a **disallowed role** accesses a protected route, asserting that a `403` status is returned.
  * A **unit test** with **no token** that asserts a `401 Unauthorized` status is returned.
    \<br\> **Acceptance Criteria:**
  * The middleware correctly allows access for users with specified roles.
  * The middleware correctly denies access for users without the specified roles.

-----

**Ticket Name:** Implement Merchant `POST /api/v1/tools` Endpoint 🆕
\<br\> **Ticket Number:** TICKET-2003
\<br\> **Description:** Create the API endpoint that allows a logged-in `Merchant` user to register a new tool. This will be the first endpoint to use our new RBAC middleware.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /api/v1/tools`
  * **Protection**: Protected by `rbacMiddleware(['MERCHANT'])`.
  * **Request Body**:
    ```json
    {
      "name": "string",
      "description": "string",
      "pricing_model": { "type": "string", "cost_per_use": "number" },
      "api_specification_url": "string"
    }
    ```
  * **Success Response**: `201 Created` with the new tool's ID.
  * **Error Responses**: `403 Forbidden` if the user is not a Merchant.
  * **Logic**:
    1.  Validate the request body.
    2.  Use the `user_id` from the JWT to link the new tool to the Merchant.
    3.  Insert a new record into the `tools` table.
        \<br\> **Test Suite Design:**
  * An **integration test** where a **Merchant** user successfully creates a tool.
  * An **integration test** where an **Agent** user attempts to create a tool, asserting a `403` status.
    \<br\> **Acceptance Criteria:**
  * A Merchant can successfully create a new tool.
  * An unauthorized user cannot create a tool.

-----

**Ticket Name:** Implement Merchant `GET /api/v1/tools` Endpoint 🔍
\<br\> **Ticket Number:** TICKET-2004
\<br\> **Description:** Create a protected API endpoint that allows a `Merchant` user to view a list of all their registered tools. This endpoint will also use our new RBAC middleware.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `GET /api/v1/tools`
  * **Protection**: Protected by `rbacMiddleware(['MERCHANT'])`.
  * **Success Response**: `200 OK` with an array of tool objects.
  * **Logic**:
    1.  Use the `user_id` from the JWT.
    2.  Query the `tools` table for all records where `merchant_id` matches the user's ID.
        \<br\> **Test Suite Design:**
  * An **integration test** for a **Merchant** user with two tools that asserts a `200` status and returns an array of two tool objects.
  * An **integration test** for an **Agent** user that asserts a `403` status.
    \<br\> **Acceptance Criteria:**
  * A Merchant can view only their own tools.
  * An unauthorized user cannot view the tool list.

-----

**Ticket Name:** Implement `DELETE /api/v1/tools/{id}` Endpoint 🗑️
\<br\> **Ticket Number:** TICKET-2005
\<br\> **Description:** Create the protected API endpoint that allows a `Merchant` user to delist one of their tools. This action will set the `is_listed` flag to `false`.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `DELETE /api/v1/tools/{id}`
  * **Protection**: Protected by `rbacMiddleware(['MERCHANT'])`.
  * **Logic**:
    1.  Validate that the `tool_id` belongs to the authenticated `Merchant` user.
    2.  Update the `is_listed` column to `false` for the specified tool.
        \<br\> **Test Suite Design:**
  * An **integration test** where a **Merchant** user successfully delists their own tool.
  * An **integration test** where a **Merchant** user attempts to delist a tool owned by another merchant, asserting a `403` or `404` status.
    \<br\> **Acceptance Criteria:**
  * A Merchant can successfully delist their own tools.
  * A Merchant cannot delist another merchant's tools.

-----

**Ticket Name:** Implement NLP Analysis Function 🧠
\<br\> **Ticket Number:** TICKET-2006
\<br\> **Description:** Create a reusable, low-level function that orchestrates the NLP analysis of a given text. This function will be called by the document upload endpoint.
\<br\> **Requirements/Other docs:**

  * **Function Signature**: `analyzeWritingStyle(text)`
  * **Logic**:
    1.  Take a large string of text as input.
    2.  Construct a prompt for an external LLM (e.g., OpenAI, Anthropic) to perform a detailed stylistic analysis (e.g., lexical density, sentiment, tone).
    3.  Return a structured JSON object containing the results of the analysis.
        \<br\> **Test Suite Design:**
  * A **unit test** with a **long, well-defined text** that asserts the function returns a valid JSON object with the expected keys.
  * A **unit test** with **short or empty text** that asserts the function returns an appropriate error or a default profile.
    \<br\> **Acceptance Criteria:**
  * The function successfully returns a JSON object with the specified profile data.
  * The function handles edge cases gracefully.

-----

**Ticket Name:** Implement Writing Style Profile Endpoint 📝
\<br\> **Ticket Number:** TICKET-2007
\<br\> **Description:** Create the protected API endpoint for a user to upload a document. The document's text will be extracted and passed to the NLP analysis function, and the resulting profile will be saved to the database.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /api/v1/profile/writing-style`
  * **Protection**: The endpoint must require a valid JWT.
  * **Request Body**: A file upload (multipart/form-data) containing the user's document.
  * **Success Response**: `200 OK` with the created profile's ID.
  * **Logic**:
    1.  Extract the text content from the uploaded file.
    2.  Call the `analyzeWritingStyle` function.
    3.  Use the `user_id` from the JWT to save the resulting JSON object into the `writing_style_profiles` table.
        \<br\> **Test Suite Design:**
  * An **integration test** with a **valid file upload** that asserts a `200` status and verifies the profile data was saved to the database.
  * An **integration test** with a **missing file** that asserts a `400` status.
  * An **integration test** with an **unauthenticated user** that asserts a `401` status.
    \<br\> **Acceptance Criteria:**
  * An authenticated user can successfully upload a document and generate a new `writing_style_profiles` entry.
  * The endpoint correctly saves the generated JSON profile to the database.