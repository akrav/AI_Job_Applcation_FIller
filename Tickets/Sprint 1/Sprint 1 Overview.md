### **Sprint 1: Foundational Infrastructure & Core Data Management**

This sprint establishes the technical foundation for your application. We will set up the core database tables and API endpoints in Supabase to handle your personal data, templates, and application history.

-----

**Ticket Name:** Initialise Node.js Project & Supabase Client 🛠️
\<br\> **Ticket Number:** TICKET-101
\<br\> **Description:** This ticket covers the initial setup of the Node.js project. It involves creating the monorepo structure, installing foundational libraries like Express.js, and configuring the Supabase JavaScript client for connection.
\<br\> **Requirements/Other docs:**

  * **Project Structure**: A modular monorepo structure should be established.
  * **Dependencies**: Install `express`, `dotenv`, and the `@supabase/supabase-js` client library.
  * **Supabase Config**: Configure the Supabase client with the URL and API key from a `.env` file.
    \<br\> **Acceptance Criteria:**
  * The Node.js application can be started without errors.
  * The Supabase client is configured and can connect to the database.

-----

**Ticket Name:** Implement Supabase `Templates` Table Schema 📝
\<br\> **Ticket Number:** TICKET-102
\<br\> **Description:** Create the `Templates` table in Supabase. This table will store all the information related to your personal cover letter templates, including the content and placeholders.
\<br\> **Requirements/Other docs:**

  * **Table**: The schema must create the `Templates` table.
  * **Field Definitions**: `user_id` (FK), `content` (`TEXT`), `placeholders` (`JSONB`).
  * **Row-Level Security (RLS)**: Enable RLS and create a policy that allows a user to access only their own templates.
    \<br\> **Acceptance Criteria:**
  * The `Templates` table exists with the specified schema.
  * RLS is enabled and correctly restricts access.

-----

**Ticket Name:** Implement Supabase `MemoryBanks` Table Schema 🧠
\<br\> **Ticket Number:** TICKET-103
\<br\> **Description:** Create the `MemoryBanks` table in Supabase. This table will store your personal history and achievements.
\<br\> **Requirements/Other docs:**

  * **Table**: The schema must create the `MemoryBanks` table.
  * **Field Definitions**: `user_id` (FK), `data` (`JSONB`).
  * **Row-Level Security (RLS)**: Enable RLS and create a policy that allows a user to access only their own `MemoryBanks` data.
    \<br\> **Acceptance Criteria:**
  * The `MemoryBanks` table exists with the specified schema.
  * RLS is enabled and correctly restricts access.

-----

**Ticket Name:** Implement Supabase `WritingStyleProfiles` Table Schema 🖋️
\<br\> **Ticket Number:** TICKET-104
\<br\> **Description:** Create the `WritingStyleProfiles` table in Supabase. This table will store your AI-generated writing style profile.
\<br\> **Requirements/Other docs:**

  * **Table**: The schema must create the `WritingStyleProfiles` table.
  * **Field Definitions**: `user_id` (FK), `profile_data` (`JSONB`).
  * **Row-Level Security (RLS)**: Enable RLS and create a policy that allows a user to access only their own `WritingStyleProfiles` data.
    \<br\> **Acceptance Criteria:**
  * The `WritingStyleProfiles` table exists with the specified schema.
  * RLS is enabled and correctly restricts access.

-----

**Ticket Name:** Implement Supabase `ApplicationAnswers` Table Schema & `pgvector` 📝
\<br\> **Ticket Number:** TICKET-105
\<br\> **Description:** Create the `ApplicationAnswers` table in Supabase. This table will store your past application questions and answers, and it will be configured as a vector database.
\<br\> **Requirements/Other docs:**

  * **Table**: The schema must create the `ApplicationAnswers` table.
  * **Field Definitions**: `user_id` (FK), `question` (`TEXT`), `answer` (`TEXT`), `vector_embedding` (`vector`).
  * **`pgvector` Extension**: Enable the `pgvector` extension in the Supabase database.
  * **Row-Level Security (RLS)**: Enable RLS and create a policy that allows a user to access only their own `ApplicationAnswers`.
    \<br\> **Acceptance Criteria:**
  * The `ApplicationAnswers` table exists with the specified schema.
  * The `pgvector` extension is enabled.
  * RLS is enabled and correctly restricts access.

-----

**Ticket Name:** Implement User Registration Endpoint 🔑
\<br\> **Ticket Number:** TICKET-106
\<br\> **Description:** Create the API endpoint for user registration using Supabase Auth.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /api/v1/auth/register`.
  * **Logic**: Use the `supabase.auth.signUp()` function to create a new user.
    \<br\> **Acceptance Criteria:**
  * A new user can register in the Supabase Auth system.

-----

**Ticket Name:** Implement Profile Initialisation Logic on Registration 🧑‍💻
\<br\> **Ticket Number:** TICKET-107
\<br\> **Description:** Implement a server-side function that listens for new user registrations and automatically creates initial records in the `MemoryBanks`, `Templates`, and `WritingStyleProfiles` tables.
\<br\> **Requirements/Other docs:**

  * **Trigger**: A Supabase trigger or webhook that fires on new user creation.
  * **Logic**: The function will create a new, empty record in each of the specified tables with the `user_id` of the newly created user.
    \<br\> **Acceptance Criteria:**
  * When a new user registers, corresponding empty records are automatically created in all relevant tables.

-----

**Ticket Name:** Implement User Login Endpoint 🔑
\<br\> **Ticket Number:** TICKET-108
\<br\> **Description:** Create the API endpoint for user login. This endpoint will use Supabase Auth to verify credentials and return a JWT for protected routes.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /api/v1/auth/login`.
  * **Logic**: Use the `supabase.auth.signInWithPassword()` function and return the JWT from the session object.
    \<br\> **Acceptance Criteria:**
  * An existing user can log in and receive a JWT.
  * The endpoint returns the correct error for invalid credentials.

-----

**Ticket Name:** Implement `POST /api/v1/templates` Endpoint ✍️
\<br\> **Ticket Number:** TICKET-109
\<br\> **Description:** Create the secure API endpoint for a user to create a new template. This is the "Create" part of the CRUD functionality.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /api/v1/templates`.
  * **Security**: Must be protected by a valid JWT, and the `user_id` for the new template must be set to the ID of the authenticated user.
    \<br\> **Acceptance Criteria:**
  * An authenticated user can successfully create a new template.
  * The endpoint returns a `201 Created` status with the newly created template object.

-----

**Ticket Name:** Implement `GET /api/v1/templates` Endpoint 🖼️
\<br\> **Ticket Number:** TICKET-110
\<br\> **Description:** Implement the "Read" API endpoint for templates, allowing a user to retrieve a list of all their templates.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `GET /api/v1/templates`.
  * **Security**: Must be protected by a valid JWT.
  * **Logic**: The endpoint will return a list of all templates associated with the authenticated user's ID.
    \<br\> **Acceptance Criteria:**
  * The endpoint returns a list of templates belonging only to the authenticated user.

-----

**Ticket Name:** Implement `PUT /api/v1/templates/{id}` Endpoint 📝
\<br\> **Ticket Number:** TICKET-111
\<br\> **Description:** Create the API endpoint for a user to update an existing template. This is the "Update" part of the CRUD functionality.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `PUT /api/v1/templates/{id}`.
  * **Security**: Must be protected by a valid JWT, and the user can only update a template they own.
    \<br\> **Acceptance Criteria:**
  * An authenticated user can successfully update a template they own.
  * The endpoint returns a `200 OK` status with the updated template object.

-----

**Ticket Name:** Implement `DELETE /api/v1/templates/{id}` Endpoint 🗑️
\<br\> **Ticket Number:** TICKET-112
\<br\> **Description:** Create the API endpoint for a user to delete one of their templates.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `DELETE /api/v1/templates/{id}`.
  * **Security**: Must be protected by a valid JWT, and the user can only delete a template they own.
    \<br\> **Acceptance Criteria:**
  * An authenticated user can successfully delete a template they own.
  * The endpoint returns a `204 No Content` status.

-----

**Ticket Name:** Implement `GET /api/v1/memory-bank` Endpoint 🧠
\<br\> **Ticket Number:** TICKET-113
\<br\> **Description:** Create the API endpoint to retrieve the user's `MemoryBanks` data.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `GET /api/v1/memory-bank`.
  * **Security**: Must be protected by a valid JWT.
    \<br\> **Acceptance Criteria:**
  * The endpoint returns the `MemoryBanks` data for the authenticated user.

-----

**Ticket Name:** Implement `PUT /api/v1/memory-bank` Endpoint ✍️
\<br\> **Ticket Number:** TICKET-114
\<br\> **Description:** Create the API endpoint to update the user's `MemoryBanks` data.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `PUT /api/v1/memory-bank`.
  * **Security**: Must be protected by a valid JWT.
    \<br\> **Acceptance Criteria:**
  * An authenticated user can successfully update their `MemoryBanks` data.

-----

**Ticket Name:** Implement `GET /api/v1/writing-style-profile` Endpoint 🖋️
\<br\> **Ticket Number:** TICKET-115
\<br\> **Description:** Create the API endpoint to retrieve the user's `WritingStyleProfile`.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `GET /api/v1/writing-style-profile`.
  * **Security**: Must be protected by a valid JWT.
    \<br\> **Acceptance Criteria:**
  * The endpoint returns the `WritingStyleProfile` for the authenticated user.

-----

**Ticket Name:** Implement `PUT /api/v1/writing-style-profile` Endpoint ✍️
\<br\> **Ticket Number:** TICKET-116
\<br\> **Description:** Create the API endpoint to update the user's `WritingStyleProfile`. This will be called by the `TICKET-201` module.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `PUT /api/v1/writing-style-profile`.
  * **Security**: Must be protected by a valid JWT.
    \<br\> **Acceptance Criteria:**
  * An authenticated user can successfully update their `WritingStyleProfile`.