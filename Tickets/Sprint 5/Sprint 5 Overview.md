### **Sprint 5 Overview: Agent Tools & Memory Bank**

This sprint's purpose is to activate the agent's role on the platform and introduce the **Memory Bank** feature. We will implement the necessary database schemas and API endpoints to allow agents to browse and use tools registered by merchants. We will also create a centralized `memory_bank` for users to store personal career information, which can be dynamically accessed by our AI. This sprint culminates in the creation of the final, orchestrating endpoint that combines all the core backend services to deliver a complete product experience.

-----

### **Major Functionality Delivered**

  * **Memory Bank Schema**: A new database table, `memory_bank`, will be created to store user-specific career data.
  * **Memory Bank API**: A full set of CRUD (Create, Read, Update, Delete) endpoints for users to manage their personal data snippets.
  * **Agent Tool Browser**: A protected API endpoint that allows an authenticated `Agent` to view all available tools from the registry.
  * **Agent Credit System Logic**: A low-level function to handle the transaction logic for an agent using a tool, deducting from their balance.
  * **Final Orchestration Endpoint**: A protected endpoint for an `Agent` to select a tool, provide context (from their `Memory Bank`), and have the tool generate tailored content.

-----

### **Sprint Tickets**

The tickets are ordered to resolve dependencies, starting with the new database schema and culminating in the final API endpoint that ties everything together.

-----

**Ticket Name:** Update Database Schema for Memory Bank 🧠
\<br\> **Ticket Number:** TICKET-5001
\<br\> **Description:** This ticket involves updating our database to include a table for storing user-specific career data. This "Memory Bank" will be a key source of information for future AI interactions.
\<br\> **Requirements/Other docs:**

  * **Table**: The migration script must create the `memory_bank` table.
  * **Field Definitions**:
    ### **`memory_bank`**
    | Field Name | Specification |
    | :--- | :--- |
    | `id` | UUID, Primary Key |
    | `user_id` | UUID, Foreign Key to `users.id` |
    | `title` | VARCHAR, Not Null |
    | `content` | TEXT, Not Null |
    | `is_private` | BOOLEAN, Default: true |
    | `created_at` | TIMESTAMPZ, Not Null |
    | `updated_at` | TIMESTAMPZ, Not Null |
  * **Row-Level Security (RLS)**: Configure RLS on this table to ensure a user can only access their own data.
  * **Mermaid ERD:** Update the existing ERD to include the new `memory_bank` table.
    ```mermaid
    erDiagram
        users {
            UUID id PK
            ...
        }
        memory_bank {
            UUID id PK
            UUID user_id FK
            VARCHAR title
            TEXT content
            BOOLEAN is_private
            TIMESTAMPZ created_at
            TIMESTAMPZ updated_at
        }
        users ||--o{ memory_bank : "stores many"
    ```

\<br\> **Test Suite Design:**

  * A **migration test** that confirms the `memory_bank` table is created successfully with all specified columns and constraints.
  * A **security test** that confirms the RLS policy is enabled and correctly prevents unauthorized access.
    \<br\> **Acceptance Criteria:**
  * The `memory_bank` table is created with the specified schema and constraints.
  * RLS is correctly configured on the new table.

-----

**Ticket Name:** Implement Memory Bank Management Endpoints (CRUD) 💾
\<br\> **Ticket Number:** TICKET-5002
\<br\> **Description:** Implement a full set of CRUD endpoints for a user to manage entries in their personal Memory Bank.
\<br\> **Requirements/Other docs:**

  * **Endpoints**:
      * `POST /api/v1/memory-bank`: Create a new memory bank entry.
      * `GET /api/v1/memory-bank`: Retrieve all of a user's memory bank entries.
      * `GET /api/v1/memory-bank/{id}`: Retrieve a single entry by ID.
      * `PUT /api/v1/memory-bank/{id}`: Update an existing entry.
      * `DELETE /api/v1/memory-bank/{id}`: Delete an entry.
  * **Protection**: All endpoints must be protected with a valid JWT. RLS will handle the user-specific data access.
    \<br\> **Test Suite Design:**
  * An **integration test** suite for each endpoint to cover successful creation, retrieval, updates, and deletion.
  * A **security integration test** for each endpoint to verify that a user cannot access or modify another user's memory bank entries.
    \<br\> **Acceptance Criteria:**
  * A user can successfully perform all CRUD operations on their own memory bank entries.
  * Attempts to access or modify other users' data return a `403` or `404` error.

-----

**Ticket Name:** Implement Agent `GET /api/v1/tools` Endpoint 🧰
\<br\> **Ticket Number:** TICKET-5003
\<br\> **Description:** Create an endpoint for agents to browse a list of all publicly listed tools. This is distinct from the Merchant's endpoint, which only shows their own tools.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `GET /api/v1/tools`
  * **Protection**: Protected by `rbacMiddleware(['AGENT', 'MERCHANT', 'ADMIN'])`.
  * **Logic**:
    1.  Query the `tools` table for all records where `is_listed` is `true`.
    2.  Return a list of tool objects, including their `id`, `name`, `description`, and `pricing_model`.
        \<br\> **Test Suite Design:**
  * An **integration test** where an **Agent** user successfully retrieves a list of all listed tools.
  * An **integration test** where an **Agent** user attempts to access a tool that has `is_listed: false`, asserting it is not in the returned list.
    \<br\> **Acceptance Criteria:**
  * An authenticated agent can view a list of all publicly listed tools.
  * Tools that are not listed are correctly hidden from the list.

-----

**Ticket Name:** Implement Agent Tool Interaction Function 💸
\<br\> **Ticket Number:** TICKET-5004
\<br\> **Description:** Create a low-level, reusable function to handle the transaction logic when an agent uses a tool. This function will be called by the final application endpoint.
\<br\> **Requirements/Other docs:**

  * **Function Signature**: `processToolTransaction(agentId, toolId)`
  * **Logic**:
    1.  Retrieve the `agent` record and the `tool` record by their IDs.
    2.  Check if the agent has sufficient `balance` to cover the tool's cost (from `pricing_model`).
    3.  If the balance is sufficient, deduct the cost from the agent's `balance` and save the new value.
    4.  Log the transaction (e.g., in a new `transactions` table, if time permits, otherwise just in the application logs).
    5.  If the balance is insufficient, throw a `402 Payment Required` error.
        \<br\> **Test Suite Design:**
  * A **unit test** where a mock agent with sufficient balance uses a tool, asserting the balance is correctly deducted.
  * A **unit test** where a mock agent with insufficient balance attempts to use a tool, asserting a `402` error is thrown.
    \<br\> **Acceptance Criteria:**
  * The function correctly deducts the tool cost from the agent's balance.
  * The function prevents transactions when the agent's balance is too low.

-----

**Ticket Name:** Implement Agent `POST /api/v1/apply` Endpoint 🚀
\<br\> **Ticket Number:** TICKET-5005
\<br\> **Description:** Create the final, protected API endpoint that allows an `Agent` to trigger the entire AI application process. This endpoint will orchestrate the transaction, data retrieval, and external tool execution.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /api/v1/apply`
  * **Protection**: Protected by `rbacMiddleware(['AGENT'])`.
  * **Request Body**:
    ```json
    {
      "tool_id": "uuid",
      "memory_bank_id": "uuid",
      "writing_style_id": "uuid",
      "context": "string"
    }
    ```
  * **Success Response**: `200 OK` with the final generated content.
  * **Logic**:
    1.  Validate the request body.
    2.  Call `processToolTransaction(agentId, toolId)`.
    3.  Retrieve the user's data from `memory_bank_id` and the `writing_style_id`.
    4.  Fetch the tool's API specification from the `tools` table.
    5.  Orchestrate a final prompt using all the collected data.
    6.  Call the external tool's API with the generated prompt.
    7.  Save the final output to a new `agent_applications` table.
        \<br\> **Test Suite Design:**
  * An **integration test** for a **successful request** that asserts a `200` status and a non-empty string of generated content.
  * An **integration test** with an **insufficient balance** that asserts a `402` status.
  * An **integration test** with an **invalid tool ID** that asserts a `404` status.
    \<br\> **Acceptance Criteria:**
  * The endpoint successfully orchestrates all services: transaction, data retrieval, and external tool execution.
  * The agent's balance is updated, and the final output is saved to the database.