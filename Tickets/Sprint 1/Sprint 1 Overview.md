Here are the tickets for Sprint 1, designed to follow the low-level, dependency-driven style you outlined. They focus on establishing the foundational infrastructure and core user services for "AI Me Apply," with a specific emphasis on a test suite for every function and endpoint.

### **Sprint 1 Overview: Foundational Infrastructure & Core User Service**

This sprint's purpose is to establish the project's technical bedrock. We will build the essential, non-UI backend services for user identity and profile management. This includes setting up the project structure, defining the core database schema, and implementing API endpoints for user registration and authentication using Supabase. By the end of this sprint, we will have a secure, running backend service where users can register, log in to receive a valid JWT, and save their initial profile data.

-----

### **Major Functionality Delivered**

  * **Project Initialization**: A structured Node.js/Express monorepo with configured logging and Supabase client setup.
  * **Core Database Schema**: Initial PostgreSQL tables for `users`, `writing_style_profiles`, and `memory_banks` will be created with Row-Level Security (RLS) policies.
  * **User Registration API**: An endpoint allowing new users to register, which creates an entry in Supabase Auth and populates their initial profile tables.
  * **User Authentication API**: An endpoint for users to log in and receive a custom, time-limited JWT.
  * **User Profile Management**: A protected endpoint for authenticated users to save their initial `MemoryBanks` data and retrieve their own basic profile.

-----

### **Sprint Tickets**

The tickets are ordered to resolve dependencies, starting with project setup and moving through to the implementation of the user-facing APIs.

-----

**Ticket Name:** Initialise Node.js Project Structure & Supabase Client 🛠️
\<br\> **Ticket Number:** TICKET-1001
\<br\> **Description:** This ticket covers the initial setup of the Node.js project. It involves creating the monorepo structure, installing foundational libraries like Express.js, and configuring the Supabase JavaScript client for connection.
\<br\> **Requirements/Other docs:**

  * **Project Structure**: A modular monorepo structure should be established to house different services.
    ```
    /project-root
    ├── /services
    │   ├── /user-authentication-service
    │   └── ... (other future services)
    ├── /packages
    │   └── /common (shared utilities, types)
    └── package.json
    ```
  * **Dependencies**: Install `express`, `dotenv`, and the `@supabase/supabase-js` client library.
  * **Supabase Config**: Configure the Supabase client with the URL and API key from a `.env` file.
    \<br\> **Test Suite Design:**
  * A **unit test** that verifies the Supabase client is successfully initialized and has a valid URL and key.
    \<br\> **Acceptance Criteria:**
  * The Node.js application can be started without errors.
  * The project directory structure is in place.
  * The Supabase client is configured and can connect to the database.

-----

**Ticket Name:** Define and Implement Core Supabase Schema 🧑‍💻
\<br\> **Ticket Number:** TICKET-1002
\<br\> **Description:** This ticket involves defining and implementing the initial database schema in the Supabase PostgreSQL instance. It includes creating tables for user data and configuring Row-Level Security (RLS) policies.
\<br\> **Requirements/Other docs:**

  * **Tables**: The schema must create the `users`, `writing_style_profiles`, and `memory_banks` tables.
  * **Field Definitions**:
      * **`users`**: `id` (`UUID`, PK from Supabase Auth), `email` (`VARCHAR`, Unique), `name` (`VARCHAR`), `created_at` (`TIMESTAMPZ`).
      * **`writing_style_profiles`**: `user_id` (`UUID`, PK/FK to `users.id`), `profile_data` (`JSONB`), `created_at` (`TIMESTAMPZ`).
      * **`memory_banks`**: `user_id` (`UUID`, PK/FK to `users.id`), `data` (`JSONB`), `created_at` (`TIMESTAMPZ`).
  * **Row-Level Security (RLS)**: Enable RLS on all three tables and create a policy that only allows a user to `SELECT`, `INSERT`, `UPDATE`, and `DELETE` rows where `user_id` is equal to their own authenticated user ID.
    \<br\> **Test Suite Design:**
  * A **database migration script** that can be run to create the tables.
  * A **verification script** to check for the existence of all tables and the correct RLS policies.
    \<br\> **Acceptance Criteria:**
  * All three tables exist with the correct schemas.
  * The RLS policies are enabled and correctly prevent unauthorized access.

-----

**Ticket Name:** Implement `createUserInSupabase` Function ➕
\<br\> **Ticket Number:** TICKET-1003
\<br\> **Description:** This ticket covers the implementation of a reusable function that communicates with the Supabase Auth API to create a new user. This is a low-level function that will be used by the registration endpoint.
\<br\> **Requirements/Other docs:**

  * **Function Signature**: `createUserInSupabase(email, password)`
  * **Logic**: Use the Supabase client to call `supabase.auth.signUp()`.
  * **Error Handling**: The function must catch and re-throw specific errors, such as a "user with this email already exists" error.
    \<br\> **Test Suite Design:**
  * A **unit test** for the function with a **new email** that asserts a user is created in Supabase.
  * A **unit test** for the function with an **existing email** that asserts a specific error is thrown.
    \<br\> **Acceptance Criteria:**
  * The function successfully creates a new user in Supabase Auth.
  * The function correctly handles a duplicate email by throwing a catchable error.

-----

**Ticket Name:** Implement `signInWithSupabase` Function 🔑
\<br\> **Ticket Number:** TICKET-1004
\<br\> **Description:** This ticket covers the implementation of a low-level function that authenticates a user with Supabase. It takes a user's credentials and returns a session object with a JWT.
\<br\> **Requirements/Other docs:**

  * **Function Signature**: `signInWithSupabase(email, password)`
  * **Logic**: Use the Supabase client to call `supabase.auth.signInWithPassword()`.
  * **Error Handling**: The function must handle success and error responses, such as invalid credentials.
    \<br\> **Test Suite Design:**
  * A **unit test** for the function with **valid credentials** that asserts a session object is returned.
  * A **unit test** for the function with **invalid credentials** that asserts a specific error is thrown.
    \<br\> **Acceptance Criteria:**
  * The function successfully authenticates a user and returns a session object.
  * The function correctly handles invalid credentials by throwing a catchable error.

-----

**Ticket Name:** Implement User Registration Endpoint ✍️
\<br\> **Ticket Number:** TICKET-1005
\<br\> **Description:** Create the public-facing API endpoint for new user registration. This endpoint will orchestrate the creation of a user in Supabase Auth and then populate the corresponding records in the `users` and `memory_banks` tables.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /api/v1/auth/register`
  * **Request Body**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  * **Success Response**: `201 Created` with a success message.
  * **Logic**:
    1.  Call the `createUserInSupabase` function.
    2.  If successful, use the returned user ID (`id`) to create a new record in the `users` and `memory_banks` tables.
        \<br\> **Test Suite Design:**
  * An **integration test** for a **successful registration** that asserts a `201` status and verifies the user exists in Supabase Auth and the `users` and `memory_banks` tables.
  * An **integration test** for a **duplicate email** that asserts a `409 Conflict` status.
  * An **integration test** for **invalid input** (e.g., missing email) that asserts a `400 Bad Request` status.
    \<br\> **Acceptance Criteria:**
  * A successful call creates a user in Supabase and the correct tables in the app database.
  * An attempt to register with a duplicate email returns a `409` status.

-----

**Ticket Name:** Implement User Login Endpoint ➡️
\<br\> **Ticket Number:** TICKET-1006
\<br\> **Description:** Create the public-facing API endpoint for user login. This endpoint will use the `signInWithSupabase` function and return a JWT that the client can use for future requests.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /api/v1/auth/login`
  * **Request Body**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  * **Success Response**: `200 OK` with a JSON body containing the JWT (`{ "token": "..." }`).
  * **Logic**:
    1.  Call the `signInWithSupabase` function.
    2.  If successful, extract the JWT from the session object and return it.
        \<br\> **Test Suite Design:**
  * An **integration test** for a **successful login** that asserts a `200` status and a valid JWT is returned.
  * An **integration test** for **invalid credentials** that asserts a `401 Unauthorized` status.
    \<br\> **Acceptance Criteria:**
  * A successful login returns a `200 OK` with a valid JWT.
  * A login attempt with invalid credentials returns a `401 Unauthorized` error.

-----

**Ticket Name:** Implement User Profile Retrieval Endpoint ℹ️
\<br\> **Ticket Number:** TICKET-1007
\<br\> **Description:** Create the protected endpoint that allows a logged-in user to retrieve their own basic profile information. This endpoint will serve as the first test of the RLS policies and JWT validation.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `GET /api/v1/users/me`
  * **Protection**: The endpoint must require a valid JWT in the `Authorization` header.
  * **Success Response**: `200 OK` with a JSON body containing the user's `name` and other basic data from the `users` table.
    \<br\> **Test Suite Design:**
  * An **integration test** for a **valid JWT** that asserts a `200` status and the correct user data is returned.
  * An **integration test** for an **invalid or missing JWT** that asserts a `401 Unauthorized` status.
  * A **cross-user test** that attempts to retrieve another user's data (to check RLS) and asserts a `401` or `404` status.
    \<br\> **Acceptance Criteria:**
  * An authenticated request to the endpoint returns the correct user data.
  * An unauthenticated request fails with a `401` error.
  * A request with a valid token from User A cannot retrieve data belonging to User B.

-----

**Ticket Name:** Implement Initial Profile Onboarding Endpoint 📝
\<br\> **Ticket Number:** TICKET-1008
\<br\> **Description:** Create the protected endpoint that allows a newly registered user to save their initial `MemoryBanks` data during the onboarding process. This will be a simple, one-time data save.
\<br\> **Requirements/Other docs:**

  * **Endpoint**: `POST /api/v1/profile/onboard`
  * **Protection**: The endpoint must require a valid JWT.
  * **Request Body**: A JSON object containing the initial profile data (e.g., `{"work_experience": "...", "skills": "..."}`).
  * **Success Response**: `200 OK` with a success message.
  * **Logic**: The endpoint will update the `data` column of the `memory_banks` table for the authenticated user.
    \<br\> **Test Suite Design:**
  * An **integration test** for a **successful data save** that asserts a `200` status and verifies the data was correctly stored in the `memory_banks` table via a direct database query.
  * An **integration test** for a **missing JWT** that asserts a `401 Unauthorized` status.
    \<br\> **Acceptance Criteria:**
  * An authenticated user can successfully save their initial profile data.
  * The saved data is correctly persisted in the `memory_banks` table.
  * The endpoint is protected and rejects unauthorized requests.