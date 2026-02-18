# Deploying to Vercel

This guide explains how to deploy your `student-cdm` Next.js application to Vercel.

## Prerequisites

1.  **GitHub Repository**: Ensure your project is pushed to a GitHub repository.
    ```bash
    git add .
    git commit -m "Ready for deployment"
    git push origin main
    ```
2.  **Vercel Account**: Create an account at [vercel.com](https://vercel.com) if you haven't already.

## Step 1: Import Project into Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Connect your GitHub account if prompted.
4.  Find your `student-cdm` repository and click **"Import"**.

## Step 2: Configure Project

1.  **Framework Preset**: It should automatically detect **Next.js**.
2.  **Root Directory**: If your project is in a subdirectory, edit this. Otherwise, leave it as `./`.
3.  **Environment Variables**:
    You must copy the variables from your local `.env.local` file to the Vercel deployment.
    
    Expand the **"Environment Variables"** section and add the following:

    | Name | Value (Copy from `.env.local`) |
    | :--- | :--- |
    | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` |

    > **Note:** You generally do **not** need the `SUPABASE_SERVICE_ROLE_KEY` in Vercel unless you have API routes that use it. For client-side functionality, only the URL and Anon Key are required.

## Step 3: Deploy

1.  Click **"Deploy"**.
2.  Vercel will build your application. This may take a minute.
3.  Once complete, you will see a success screen with a screenshot of your app.
4.  Click the dashboard to verify the live URL.

## Important Notes on Data Imports

The data import scripts (`import-institutes.js`, `import-students.js`) are designed to run **locally** on your machine.

-   **Do not run these scripts on Vercel.**
-   To update data in your production database, run these scripts on your local computer, ensuring your local `.env.local` points to the correct production Supabase instance.
