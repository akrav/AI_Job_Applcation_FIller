### **Sprint 6 Overview: Admin Dashboard, Merchant Tool Management, and System Logging**

This sprint's purpose is to build the administrative and operational features necessary for the platform's long-term health. We will implement a backend for a basic admin dashboard, enabling platform administrators to oversee user activity and revenue. Concurrently, we will create a dedicated API for **merchants** to manage their **tools** in the registry. Finally, we'll establish a robust logging system to track all agent-tool transactions, providing crucial business intelligence and a foundation for billing.

-----

### **Major Functionality Delivered**

  * **Admin Dashboard API**: A protected endpoint for administrators to retrieve a comprehensive list of all users and key platform metrics.
  * **Merchant Tool Management**: A full set of **CRUD** (Create, Read, Update, Delete) endpoints that allow a `MERCHANT` to manage only their own registered tools.
  * **Transaction Logging System**: A new database table and corresponding functions to record every time an agent uses a tool, including details like cost and timestamp.
  * **Enhanced RBAC**: Fine-grained access control to ensure only `MERCHANTS` can manage their tools and only `ADMINS` can access the dashboard and transaction logs.

-----

### **Sprint Tickets**

The tickets are ordered to resolve dependencies, starting with the new database schema for logging and culminating in the administrative and merchant-facing APIs.

-----

**Ticket Name:** Implement Transaction Logging Schema 📊
\<br\> **Ticket Number:** TICKET-6001
\<br\> **Description:** This ticket involves creating a new database table to log every successful agent-tool transaction. This will provide a historical record for billing, analytics, and dispute resolution.
\<br\> **Requirements/Other docs:**

  * **Table**: The migration script must create the `transactions` table.
  * **Field Definitions**:
    ### **`transactions`**
    | Field Name | Specification |
    | :--- | :--- |
    | `id` | UUID, Primary Key |
    | `agent_id` | UUID, Foreign Key to `users.id` |
    | `tool_id` | UUID, Foreign Key to `tools.id` |
    | `cost` | DECIMAL(10, 2), Not Null |
    | `timestamp` | TIMESTAMPZ, Not Null, Default: now() |
  * **Row-Level Security (RLS)**: Configure RLS on this table to prevent non-admin users from accessing or modifying transaction records.
    \<br\> **Test Suite Design:**
  * A **migration test** that confirms the `transactions` table is created successfully with all specified columns and constraints.
  * A **security test** that confirms the RLS policy is enabled and prevents non-admin users from querying the table.
    \<br\> **Acceptance Criteria:**
  * The `transactions` table is created in the database with the specified schema and foreign key relationships.
  * RLS is correctly configured, allowing only admins to view all transactions.

-----

**Ticket Name:** Update Transaction Function to Log Actions 📝
\<br\> **Ticket Number:** TICKET-6002
\<br\> **Description:** This ticket modifies the existing low-level `processToolTransaction` function to also create a record in the new `transactions` table after a successful balance deduction.
\<br\> **Requirements/Other docs:**

  * **Function**: Update `processToolTransaction(agentId, toolId)`
  * **Logic**:
    1.  After a successful balance deduction, the function must insert a new record into the `transactions` table.
    2.  The record should include the `agent_id`, `tool_id`, `cost`, and the current `timestamp`.
        \<br\> **Test Suite Design:**
  * A **unit test** where a mock agent successfully uses a tool, asserting that a new record is created in the mock `transactions` table with the correct data.
  * An **integration test** for the `POST /api/v1/apply` endpoint, asserting that a successful request results in both a balance deduction and a new transaction log entry.
    \<br\> **Acceptance Criteria:**
  * Every successful agent-tool interaction creates a corresponding entry in the `transactions` table.
  * The new transaction entry contains accurate data about the interaction.

-----

**Ticket Name:** Implement Admin Dashboard API Endpoint 🧑‍💼
\<br\> **Ticket Number:** TICKET-6003
\<br\> **Description:** Create a protected API endpoint for the admin dashboard. This endpoint will return an overview of platform usage, including a list of all users and total revenue.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `GET /api/v1/admin/dashboard`
  * **Protection**: Protected by `rbacMiddleware(['ADMIN'])`.
  * **Success Response**: A `200 OK` response with a JSON object containing the following:
      * `total_users`: Count of all users in the `users` table.
      * `total_merchants`: Count of users with `account_type` set to `MERCHANT`.
      * `total_agents`: Count of users with `account_type` set to `AGENT`.
      * `total_revenue`: The sum of all `cost` from the `transactions` table.
        \<br\> **Test Suite Design:**
  * An **integration test** for a **successful request** from an **ADMIN** user, asserting the response contains the correct counts and a non-negative total revenue.
  * A **security integration test** for a request from a `MERCHANT` or `AGENT` user, asserting a `403 Forbidden` error.
    \<br\> **Acceptance Criteria:**
  * An authenticated admin can retrieve a dashboard overview.
  * Non-admin users are correctly denied access with a `403` error.

-----

**Ticket Name:** Implement Merchant Tool Management Endpoints (CRUD) 🔧
\<br\> **Ticket Number:** TICKET-6004
\<br\> **Description:** Create a full set of CRUD endpoints for a `MERCHANT` to manage the tools they have registered. This ensures merchants have control over their own services.
\<br\> **Requirements/Other docs:**

  * **Endpoints**:
      * `POST /api/v1/merchant/tools`: Create a new tool.
      * `GET /api/v1/merchant/tools`: Retrieve all tools owned by the merchant.
      * `GET /api/v1/merchant/tools/{id}`: Retrieve a single tool by ID.
      * `PUT /api/v1/merchant/tools/{id}`: Update an existing tool.
      * `DELETE /api/v1/merchant/tools/{id}`: Delete a tool.
  * **Protection**: All endpoints must be protected by `rbacMiddleware(['MERCHANT'])`. RLS will ensure a merchant can only manage their own tools.
    \<br\> **Test Suite Design:**
  * An **integration test** suite for each endpoint to cover successful creation, retrieval, updates, and deletion by a **MERCHANT**.
  * A **security integration test** for a request from one `MERCHANT` attempting to access or modify another `MERCHANT`'s tools, asserting a `403` or `404` error.
    \<br\> **Acceptance Criteria:**
  * A merchant can successfully perform all CRUD operations on their own tools.
  * Merchants are correctly prevented from managing tools registered by other merchants.