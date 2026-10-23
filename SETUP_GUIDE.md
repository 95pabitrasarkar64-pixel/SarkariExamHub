# SarkariExamHub — Beginner's External Setup & Configuration Guide

Welcome to SarkariExamHub! This guide explains step-by-step how to obtain and configure all external API keys and services needed to run your platform in both development and production.

---

## 1. Summary of Required Accounts & Credentials

| Service | Purpose | Required Secrets | Cost / Free Tier |
| :--- | :--- | :--- | :--- |
| **Google AI Studio** | AI Question Extraction from PDFs, multimodal OCR, question bank structuring | `GEMINI_API_KEY` | Generous **Free Tier** available with RPM limits |
| **Supabase** | Cloud PostgreSQL Database, User Authentication, Row-Level Security (RLS) | `NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY`<br>`SUPABASE_SERVICE_ROLE_KEY` | **Free Tier** (500MB database, 50,000 monthly active users) |
| **Razorpay** | Indian Payment Gateway (UPI, RuPay, Debit/Credit Cards, Netbanking) | `NEXT_PUBLIC_RAZORPAY_KEY_ID`<br>`RAZORPAY_KEY_SECRET`<br>`RAZORPAY_WEBHOOK_SECRET` | Free to create account; standard ~2% transaction fee on successful payments |

---

## 2. Step-by-Step Setup Instructions

### Part A: Google Gemini API (AI Question Importer)

1. **Create Account**: Visit [Google AI Studio](https://aistudio.google.com) and log in with your Google account.
2. **Generate API Key**:
   - Click on the blue **"Get API key"** button on the top left.
   - Click **"Create API key in new project"** (or select an existing Google Cloud project).
   - Copy the generated API key (it begins with `AIzaSy...`).
3. **Where to Add the Key**:
   - In your local development file `.env.local` (or in your hosting provider's Environment Variables panel):
     ```env
     GEMINI_API_KEY=AIzaSyYourGeneratedKeyHere
     ```
   - **Security Rule**: Keep this secret server-side only. Never prefix it with `NEXT_PUBLIC_` and never share it publicly.

---

### Part B: Supabase (Database & User Authentication)

1. **Create Account**: Visit [Supabase](https://supabase.com) and click **"Start your project"**.
2. **Create New Project**:
   - Give your project a name (e.g. `sarkariexamhub-db`).
   - Set a strong database password and select a region close to your target audience (e.g. **Mumbai, India - `ap-south-1`**).
3. **Run Initial Database Schema**:
   - In the Supabase dashboard sidebar, click **SQL Editor**.
   - Open the file in your repository: `/supabase/migrations/20261023021236_0001_core_schema.sql`.
   - Paste the SQL script into the SQL Editor and click **Run**. This creates the tables for profiles, organizations, exam categories, and SaaS plans.
4. **Obtain API Keys**:
   - In the sidebar, click the **Settings (Gear icon)** -> **API**.
   - Copy **Project URL**:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
     ```
   - Copy the `anon` / `public` API key:
     ```env
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
     ```
   - Copy the `service_role` (secret) key (used only by backend server tasks):
     ```env
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
     ```

---

### Part C: Razorpay (Payment Gateway)

1. **Create Account**: Visit [Razorpay Dashboard](https://dashboard.razorpay.com) and sign up with your email.
2. **Toggle Test Mode vs. Live Mode**:
   - In the top header bar, ensure the toggle is set to **Test Mode** (orange badge) while testing.
   - For real student transactions in production, you will complete KYC activation and switch to **Live Mode**.
3. **Generate API Keys**:
   - Go to **Account & Settings** -> **API Keys** (under Developer Controls).
   - Click **"Generate Key"**.
   - Copy both the **Key ID** and **Key Secret**:
     ```env
     NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
     RAZORPAY_KEY_SECRET=YourKeySecretHere
     ```
4. **Configure Webhook**:
   - Go to **Account & Settings** -> **Webhooks** -> **Add New Webhook**.
   - Webhook URL: `https://your-domain.com/api/payments/webhook`
   - Secret: Choose a strong random string (e.g. `sarkari_wh_secret_2026`) and add it to `.env.local`:
     ```env
     RAZORPAY_WEBHOOK_SECRET=sarkari_wh_secret_2026
     ```
   - Active Events: check `order.paid`, `payment.captured`, and `payment.failed`.

---

## 3. How to Test Each Integration

### Testing the AI Question Importer
1. Go to the website URL: `/ai-importer`.
2. Attach a sample PDF or paste question text with options A, B, C, D.
3. Click **"Extract Structured MCQs"**.
4. **Expected Result**: The Gemini model parses each question stem, extracts 4 choices, verifies the answer key, and shows the question review cards with approval buttons.

### Testing Razorpay Payments
1. Go to `/materials`.
2. Click **"Buy ₹149"** on any premium study material.
3. The secure checkout modal opens. Click **"Pay ₹..."**.
4. **Expected Result**: The server creates the order, verifies the HMAC SHA256 cryptographic signature, and unlocks the student's personalized watermarked viewer with access confirmation.

### Testing Server-Side Exam Scoring & Answer Protection
1. Go to `/mock-tests`.
2. Click **"Start Test"** on any examination (e.g. SSC CGL Tier 1 All-India Mock).
3. Answer several questions, mark one for review, and click **"Submit Examination"**.
4. **Expected Result**: The test is scored server-side using `/api/exams/submit` (evaluating correct answers, positive marks, and negative marking penalties), and the complete answer key with detailed explanations is revealed on the scorecard.

---

## 4. Diagnosing Common Errors

| Symptom / Error | Cause | How to Fix |
| :--- | :--- | :--- |
| `GEMINI_API_KEY is not configured` | Missing key in `.env.local` | Add `GEMINI_API_KEY=AIzaSy...` and restart your dev server. |
| `Invalid payment signature` | Mismatched `RAZORPAY_KEY_SECRET` | Verify that the Key Secret entered in `.env.local` matches the Key ID generated in Razorpay Dashboard. |
| `Supabase connection timeout` | Incorrect project URL or key | Check that `NEXT_PUBLIC_SUPABASE_URL` begins with `https://` and has no trailing slash. |
| 429 Quota Exceeded on Gemini | Free tier RPM limit reached | Gemini Flash free tier permits 15 requests per minute. Wait 30 seconds before submitting another large batch. |

---

## 5. Security & Deployment Best Practices

1. **Never Commit Secrets to Git**: Always keep real keys in `.env.local` or your hosting dashboard's Environment Variables. `.gitignore` already protects `.env*.local`.
2. **Keep Webhook Idempotency Active**: The server automatically deduplicates incoming events to protect against double-charging or repeat enrollments.
3. **Personalized PDF Watermarks**: The in-browser viewer automatically imprints the student's legal name and user ID diagonally across pages to discourage unauthorized digital distribution.
