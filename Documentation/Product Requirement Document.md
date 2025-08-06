-----

# Product Requirements Document: AI Me Apply

**Version:** 4.0
\<br\> **Date:** August 6, 2025
\<br\> **Author:** Gemini AI
\<br\> **Status:** Final Draft

-----

## 1\. Introduction & Vision

### 1.1 Vision

To become the indispensable co-pilot for the modern job seeker, transforming the stressful, time-consuming task of applying for jobs into an efficient, intelligent, and authentic experience. The core mission is to empower users to land their dream job faster by ensuring every application—from the cover letter to the nuanced question responses—appears meticulously crafted and deeply personalized. We aim to make every user look like the ideal candidate who went above and beyond.

### 1.2 Problem Statement

The current job application process is fundamentally broken. Job seekers are forced to choose between two undesirable paths: sending out generic, low-effort applications that are immediately discarded by Applicant Tracking Systems (ATS) and recruiters, or spending countless hours meticulously tailoring each resume and cover letter. This repetitive and exhausting process often leads to burnout, low-quality applications, and missed opportunities. Existing tools are mere template fillers and lack the intelligence to capture a user's unique voice and professional history, resulting in applications that fail to stand out in a competitive job market.

### 1.3 MVP Goal

The goal of this Minimum Viable Product (MVP) is to **validate the core value proposition**: that we can automatically generate a personalized cover letter and intelligently answer application questions, reflecting a user's unique writing style and tailoring the content to a specific company.

The MVP will deliver:

  * A web portal for user account creation and management.
  * A workflow to generate a foundational, detailed **Writing Style Profile** from user-uploaded documents.
  * The ability to upload an existing cover letter and designate it as a dynamic **template**.
  * A simple interface to input a company URL and trigger intelligent web scraping of key company pages.
  * The core generation logic to produce personalized, "humanized" content to fill in the cover letter template and answer application questions.
  * An interactive UI that allows users to select from multiple generated options for custom lines or answers, and select the length of the response.
  * The ability to download the final document as a PDF.

-----

## 2\. Target Audience

The primary target audience consists of job seekers across all industries and experience levels who are actively applying to multiple positions and recognize the need for high-quality, personalized applications. This includes:

  * **Alex, the Ambitious Professional:** An experienced professional (e.g., software engineer, marketing manager) who is time-poor and actively looking for a new role. They apply to 5-10 jobs a week and recognize that personalization is key but hate the tedious, repetitive work of rewriting their cover letter for each role. Their goal is to land a high-quality job within three months.
  * **Sam, the Entry-Level Applicant:** A recent graduate or career-changer who lacks extensive professional writing samples and struggles to articulate their transferable skills effectively. They are unsure how to research a company and incorporate its values into their application. Their goal is to secure their first significant role in a new field and learn how to write compelling application materials.

-----

## 3\. System Features & Requirements

This section provides a highly detailed breakdown of the features required to build the core product.

### 3.1 Onboarding & Profile Core

This is the foundational experience that empowers the entire application. We need to capture and analyze a user's unique professional identity in two key ways: their **Writing Style Profile** (how they write) and their **Memory Bank** (what they write about).

#### 3.1.1 Account Management

This is a standard requirement for any web application, providing a secure way for users to create, access, and manage their personal accounts.

  * **Requirement:** Users must be able to create a secure account using a valid email and password.
  * **Requirement:** The system must also support a streamlined account creation and login process via a third-party OAuth provider (e.g., Google).
  * **Requirement:** Users must have the ability to log in, log out, and securely manage their basic profile information, including their name and password.

#### 3.1.2 Writing Style Profile Generation

The Writing Style Profile is the core of our "AI Humanization" layer. It is a sophisticated, multi-layered Natural Language Processing (NLP) analysis of a user's existing writing. This profile, which should be based on a minimum of 2,000 words of user-uploaded text, is the "digital voice" that will be used to guide all future content generation.

  * **Requirement:** The user interface must provide a clear and intuitive drag-and-drop or file upload interface for users to submit multiple writing samples in common formats (e.g., .txt, .md, .pdf, .docx). The UI should provide clear guidance on the types of documents to upload (e.g., essays, professional emails, blog posts).
  * **Requirement:** The backend must process these documents to generate a comprehensive Writing Style Profile. For the MVP, this analysis will be stored as a structured data object (e.g., JSON) associated with the user. The analysis must be intensely thorough and include:
      * **Lexical Analysis:** A statistical model of the user's preferred vocabulary, word frequency, and words to avoid. For instance, it would note a preference for "leveraged" over "used" or a tendency to use industry-specific terms.
      * **Stylometric Features:** An analysis of the user's sentence and paragraph length distribution, as well as the overall "burstiness" (the natural variation in sentence complexity) to avoid a uniform, robotic tone.
      * **Syntactic Parsing:** A deconstruction of sentence structures to identify preferences (e.g., active vs. passive voice, use of compound sentences, placement of clauses).
      * **Punctuation Profile:** A statistical model of the user's punctuation habits, such as the use of em-dashes, semicolons, or the oxford comma.
      * **Semantic & Discourse Analysis:** An understanding of the user's common metaphors, analogies, and logical flow, including typical transition words and argument structure.
      * **Jargon & Idiom Dictionary:** A personalized database of industry-specific terms, acronyms, and unique idioms the user frequently employs. This will be used to ensure the generated content feels authentic to their field.

#### 3.1.3 The Memory Bank (MVP)

The Memory Bank acts as the AI's long-term contextual memory, giving it key facts and professional history to draw from. While the full version will have a complex file-directory structure, the MVP will use a simplified yet scalable structure to get to market faster.

  * **Requirement:** The user interface must present a series of clear, well-labeled input fields corresponding to the categories in the Memory Bank. Users should be able to input and edit their information at any time.
  * **Requirement:** The data will be stored as a structured JSON object in a database column associated with each user. The data structure will include the following key categories:
      * **`professional_history`:** Containing detailed information about a user's career and education. This will include fields for **`work_experience`**, **`education`**, and **`certifications`**.
      * **`professional_skills`:** Housing the user's hard and soft skills in separate fields: **`hard_skills`** and **`soft_skills`**.
      * **`stories`:** A critical category for user-written narratives, including fields like **`story_overcoming_a_challenge`**, **`story_leading_a_team_project`**, and **`story_a_creative_solution`**.
      * **`personal_details`:** Containing supplemental information such as **`goals`** and **`interests`**.
  * **Requirement:** The system must provide a mechanism for users to highlight text from an uploaded resume or cover letter and convert that text into a new entry in a specific Memory Bank field.
  * **Requirement:** All information in the Memory Bank, especially any personally identifiable information (PII), must be stored in an encrypted format at rest to ensure maximum security.
  * **Requirement (Post-MVP):** The system will implement a mechanism to allow the user to approve and save successful answers from the **Application Questions Workflow** directly into the Memory Bank.

### 3.2 Core Cover Letter Workflow

This is the central process of the MVP, where we prove the product's value by generating a personalized, ready-to-download cover letter.

#### 3.2.1 Template Management

Instead of forcing users to start from scratch, we allow them to build a dynamic template from their own writing. This honors their existing style and saves them time.

  * **Requirement:** A user must be able to upload or paste a pre-written cover letter directly into the platform.
  * **Requirement:** The user must be able to highlight specific parts of the letter and designate them as dynamic placeholder tokens (e.g., `[COMPANY_NAME]`, `[JOB_TITLE]`).
  * **Requirement:** A user must also be able to create a token like `[CUSTOM_INSPIRED_LINE]` to signify a section where the AI should generate unique, personalized, and company-specific content. The system should store these templates for future use.

#### 3.2.2 Company Intelligence Gathering

To generate truly personalized content, the AI needs to understand the company. We'll automate the tedious research process by scraping key information from the company's website.

  * **Requirement:** The UI must have a dedicated text input field where the user provides the URL of the target company's homepage.
  * **Requirement:** The system must be able to initiate a web scraping job to gather content from a prioritized list of pages, including "About Us," "Mission/Values," "Careers," and "Products/Services."
  * **Requirement:** The system will then use this scraped data to identify key phrases, values, or projects to inform the AI generation process.

#### 3.2.3 Personalized Content Generation

This is the moment of truth. We combine all the collected data—the user's voice, their professional history, and the company's information—to generate content that is both authentic and relevant.

  * **Requirement:** For each `[CUSTOM_INSPIRED_LINE]` token, the system must trigger the AI generation service.
  * **Requirement:** The AI's prompt must be intelligently constructed using a combination of the user's **Writing Style Profile**, relevant facts from the **Memory Bank**, and the scraped **Company Intelligence**. The system should use the scraped data for inspiration, rather than for direct quotes.
  * **Requirement:** The UI must present the user with a choice of 1-3 generated options for the custom line.
  * **Requirement:** A user should be able to hover over a generated line to see a tooltip displaying the inspirational quote or source and a direct link to the source URL.
  * **Requirement:** The user must be able to select an option, and the fully rendered cover letter will be created. The user can also highlight a newly added line and change it to another generated response.
  * **Requirement:** Upon the user's final selection, the system must render the full, personalized cover letter.
  * **Requirement:** The user must be able to download the final, polished document as a PDF, ready to be sent to a recruiter.

### 3.3 Application Questions Workflow

This feature is now a part of the MVP.

  * **Requirement:** The system must allow users to copy and paste application questions into the UI.
  * **Requirement:** For each question, the AI must generate a draft answer by synthesizing information from the user's **Writing Style Profile**, **Memory Bank**, and the scraped **Company Information**.
  * **Requirement:** The user must be able to select the desired answer size (e.g., short, medium, long) via a UI control.
  * **Requirement:** Any answer that the user copies or autofills into an application is considered "successful" and is embedded and stored in a vector database for future use on similar questions.
  * **Requirement (Post-MVP):** The user can approve a successful answer to be saved into the Memory Bank for a new a category, for example: `interview_answers/story_overcoming_a_challenge.md`

### 3.4 The AI Humanization Layer

This is a critical post-processing step applied to all AI-generated text to remove statistical artifacts and ensure the output is indistinguishable from human writing.

  * **Requirement:** All content generated by the LLM must pass through a post-processing "Humanization" service before being shown to the user.
  * **Requirement:** This service must, at a minimum, perform **Pattern Purging** to actively identify and remove common, tell-tale LLM filler words and phrases (e.g., "In conclusion," "Furthermore," "delve into").
  * **Requirement:** The service must adjust sentence length and structure to avoid robotic uniformity, adding basic "burstiness" to the text based on the user's analyzed style.
  * **Requirement:** The service will cross-reference the generated text with the user's personal **Jargon & Idiom Dictionary** and lexical profile, substituting overly generic words (e.g., "utilize," "leverage") with the user's preferred vocabulary.

### 3.5 Browser Extension Functionality

This is a key post-MVP feature but the underlying architecture needs to support it.

  * **Requirement (Post-MVP):** The browser extension will be the primary user-facing tool for active applications. Upon visiting a job posting, it will identify the company and job title and initiate the web scraping process.
  * **Requirement (Post-MVP):** The extension will allow users to autofill generic form fields on job boards, including personal information (Name, Address, Email), professional information (LinkedIn, GitHub), and demographic information.
  * **Requirement (Post-MVP):** The system must handle demographic data (e.g., veteran status, ethnic status, sexuality) as an **opt-in only** feature, storing it encrypted and only filling it if the user explicitly enables it.

-----

## 4\. Non-Functional & Technical Requirements

### 4.1 Technology Stack

  * **Database:** Supabase is the preferred solution. Its integrated PostgreSQL database and object storage are a perfect fit for this architecture. The **`pgvector`** extension should be enabled for future vector search capabilities to support features like answering similar questions.
  * **Backend:** A backend service (e.g., built with Node.js or Python) will handle LLM API calls, orchestration, the web scraping jobs, and the core logic of the Writing Style Analysis and Humanization Layer.
  * **Frontend:** A modern single-page application (SPA) framework (e.g., React, Vue).
  * **Browser Extension:** Built using standard web extension APIs to ensure compatibility with Chrome, Firefox, and Edge.

### 4.2 Security

  * **Requirement:** All user passwords must be hashed and salted. All Personally Identifiable Information (PII) in the Memory Bank must be encrypted at rest.
  * **Requirement:** The platform must comply with standard data privacy practices (e.g., GDPR, CCPA).

### 4.3 Performance

  * **Requirement:** The end-to-end response time for generating a custom line of text or an application question response (from user click to UI display) should be under 15 seconds.
  * **Requirement:** The web scraping service must have a timeout of 30 seconds to avoid hanging on unresponsive sites.

-----

## 5\. Out of Scope for MVP

To ensure a focused and achievable MVP, the following features will **not** be included in the initial release:

  * The full **Browser Extension** and its associated autofill and question-extraction capabilities.
  * The advanced, file-directory-based **Memory Bank** (MVP will use a simpler key-value store).
  * Saving of "liked lines" to dynamically retrain the style profile (the profile will be static after initial creation for the MVP).
  * Support for any language other than English.
  * A dedicated mobile application.
  * Turing Test Panels to validate the humanization layer. Qualitative User Acceptance Testing (UAT) will suffice for the MVP.

-----

## 6\. Success Metrics & KPIs

The success of the MVP will be measured by:

  * **Activation Rate:** Percentage of new users who successfully generate and download their first cover letter or answer their first question within 7 days of signing up. **Target: \>40%**.
  * **Core Action Rate:** The average number of documents generated or questions answered per active user.
  * **Qualitative Feedback (CSAT):** A simple one-question survey after download: "How satisfied are you with the quality and personalization of this document/answer?" (Scale of 1-5). **Target: \>4.0**.
  * **User Retention:** Percentage of users who return to use the service again within the first 14 days. **Target: \>20%**.