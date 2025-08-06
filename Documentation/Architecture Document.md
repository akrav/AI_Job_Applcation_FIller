# Architecture Document: AI Me Apply

**Version:** 1.0
\<br\> **Date:** August 6, 2025
\<br\> **Author:** Gemini AI

## 1\. System Overview

This document outlines the technical architecture for the **AI Me Apply MVP**, with a specific focus on leveraging **Supabase** as the primary Backend-as-a-Service (BaaS) provider. The system is designed as a modular, monolithic application for a single developer, simplifying the stack and speeding up development while allowing for future scalability.

The architecture is composed of:

  * A **Frontend Web Portal** built with React for all user interactions.
  * A single, **Backend Monolith** that orchestrates all core application logic.
  * A **Supabase BaaS** that serves as the comprehensive data storage, authentication, and file management layer.

This approach minimizes the number of services to manage, allowing for a focused development cycle. The diagram below illustrates the high-level interaction between the major components.

## 2\. Frontend: Web Portal

This is the user-facing web application that provides the graphical interface for all user interaction with the platform.

  * **Selected Technology - React:** React remains the ideal choice for its component-based architecture, which simplifies the creation of complex, interactive UIs. The vast ecosystem of libraries and strong community support make it a reliable and efficient choice for a single developer.

  * **Key Components:**

      * **Onboarding & Profile UI:** Guides new users through account creation and the initial process of uploading documents for the **Writing Style Profile** and populating the **Memory Bank**.
      * **Document Upload Interface:** A dedicated UI with drag-and-drop functionality for users to upload various file types (.txt, .md, .pdf, .docx).
      * **Memory Bank Editor:** An interface with structured forms for users to input and edit their personal and professional information.
      * **Cover Letter Template Manager:** An editor that allows users to upload a cover letter, highlight text, and designate sections as dynamic tokens.
      * **Generation & Review UI:** The central workspace where users trigger content generation and review the AI's output. This UI will include hover-over functionality to reveal source links and provide alternative options.
      * **Application Questions Panel:** An interface to paste in a question, select a desired length, and view generated responses.
      * **Document Download UI:** A simple button to download the finalized, personalized document as a PDF.

-----

## 3\. Backend: Monolithic Application

This is the central engine of the application, handling all business logic and orchestrating calls to external services and Supabase.

  * **Selected Technology - Node.js with Express.js:** This remains the preferred choice, as it creates a unified JavaScript stack with the React frontend. For a single developer, a well-structured monolith using Express.js is easier to manage than a microservice architecture, yet it remains modular for potential future expansion.

  * **Core Logic & Services:** The backend will be a single Node.js application, with each major function encapsulated in a dedicated module. These modules are not separate services but rather logical components within the monolith.

      * **User & Authentication Handler:** This module will manage user sessions and requests. It will primarily interface with the **Supabase Auth** service to verify user identities via JWTs for all protected routes.
      * **NLP Analysis Module:** This module orchestrates the complex NLP tasks. It will receive user-uploaded documents and use an external LLM API to perform the analysis, which will then be stored in the `WritingStyleProfiles` table in the database.
      * **Web Scraping Module:** A dedicated module that takes a company URL and uses a third-party library (e.g., Cheerio or Puppeteer) to scrape text from key company pages. This data is temporarily stored in memory before being used in the generation prompt.
      * **Content Generation & Orchestration Module:** This is the core of the application. It will construct the AI prompt by retrieving data from the user's **Writing Style Profile** and **Memory Bank** (from Supabase), combining it with the scraped **Company Intelligence**, and then sending the request to an external LLM API (e.g., OpenAI, Anthropic).
      * **AI Humanization Module:** A post-processing layer that filters all generated content. It will use the `WritingStyleProfile` data to refine the text, ensuring it aligns with the user's personal style, before it's sent back to the frontend.
      * **File Management Module:** This module handles the logic for securely uploading user documents to **Supabase Storage** and retrieving them when needed. It also manages the process of generating the final PDF for the user to download.

-----

## 4\. Data Storage: Supabase BaaS

This layer is the heart of the architecture. Supabase's integrated features provide a cost-effective, all-in-one solution for a personal project.

  * **Primary Database - PostgreSQL with `pgvector`:** The core data will be stored in a PostgreSQL database managed by Supabase. This provides a robust, relational database with a familiar SQL interface.

      * The **`pgvector`** extension will be enabled to store vector embeddings for the **Application Questions** feature. This allows for efficient semantic search, so when a user uploads a new question, the system can find and use similar, previously successful answers to inform the prompt.

  * **File Storage:** User-uploaded documents and generated PDFs will be stored in **Supabase Storage**. This service is a robust object storage solution that is integrated with the Supabase Auth system, allowing for secure, user-specific access control.

  * **Authentication:** Supabase's built-in **Auth** service will be used for user management. It provides a secure, easy-to-implement system for user registration and login, including support for third-party providers like Google. This significantly reduces development time and ensures a high level of security without extra effort.

### 4.1. Key Data Models

The database will be structured around the following core concepts:

  * **Users:** This is the central table for identity and authentication. It will be managed directly by Supabase Auth.
  * **`WritingStyleProfiles`:** This table stores the detailed JSON object generated by the NLP analysis, linked to a `user_id`.
  * **`MemoryBanks`:** This table stores the structured JSON object containing all of the user's personal and professional information, linked to a `user_id`.
  * **`Templates`:** This model stores the user's cover letter templates, including the dynamic placeholder tokens.
  * **`ApplicationAnswers`:** This is a crucial table for the new feature. It will have a `question` column, an `answer` column, and a `vector_embedding` column. The `pgvector` extension will be used to create an index on the embedding for fast similarity searches.

-----

## 5\. Cross-Cutting Concerns

### 5.1. API Design

The backend will expose a **versioned RESTful API**. All endpoints will be prefixed with `/api/v1/` to ensure that future changes can be introduced without breaking the frontend client.

### 5.2. Security Model

Security will be handled by Supabase. User authentication will be managed by Supabase Auth, which issues JWTs. All API routes will be protected by validating these tokens. For data security, **Supabase's Row-Level Security (RLS)** will be configured to ensure that a user can only access their own data in the database. All sensitive data and uploaded files will be handled securely by Supabase's integrated services.

### 5.3. Deployment Strategy

For a single developer and a free-tier project, the deployment strategy will focus on simplicity and cost-effectiveness. The Node.js monolithic backend will be containerized using **Docker**. This Docker image can then be deployed to a serverless container platform like **Google Cloud Run** or **AWS Fargate**. Both platforms have free tiers and simplify the deployment and scaling process, removing the need for a developer to manage a full server. The React frontend can be easily deployed to a static site hosting service like **Vercel** or **Netlify**.

### 5.4. External Service Reliability

The system's reliability depends on external services (LLM APIs and web scraping). The backend will implement **timeouts** for all external API calls (e.g., 15-30 seconds). If a service is unresponsive, a graceful error message will be returned to the user without crashing the application.