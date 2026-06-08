# PageInsights

PageInsights is a comprehensive web performance analysis tool and dashboard. It leverages the Google PageSpeed Insights API to analyze website performance, accessibility, SEO, and best practices. Integrated with an AI companion (PerfBuddy AI) powered by Google Gemini, PageInsights provides actionable optimization advice and historical tracking to help developers improve their web applications.

This directory contains the **Frontend** application for PageInsights.

## 🌟 Features

- **Deep Performance Audits:** Analyzes both mobile and desktop versions of any given URL, pulling Core Web Vitals like LCP, FCP, TBT, CLS, and Speed Index.
- **Historical Tracking:** Saves scan reports over time in a Supabase database, allowing you to track performance improvements or regressions.
- **AI-Powered Insights:** Uses Google Generative AI (Gemini) to process Lighthouse audits and highlight the most impactful optimization opportunities.
- **PerfBuddy AI:** An interactive chat assistant to help you understand audit metrics and provide code-level fixes.
- **Modern UI:** Built with Next.js, React 19, Tailwind CSS v4, Framer Motion, and Recharts for beautiful data visualization and a smooth user experience.

## 💻 Tech Stack

### Frontend (This Directory)
- **Framework:** [Next.js](https://nextjs.org/) (App Router), React 19
- **Styling:** Tailwind CSS v4, Framer Motion
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **Data Fetching:** Axios

### Backend
- **Server:** Node.js, Express
- **Database:** Supabase (PostgreSQL)
- **APIs:** Google PageSpeed Insights API, Google Generative AI (Gemini)

## 🚀 Getting Started (Frontend)

Follow these instructions to run the frontend application locally.

### Prerequisites

Ensure you have Node.js (v20+ recommended) and `npm` installed. You will also need the backend server running to fetch data properly.

### 1. Installation

Navigate to the `frontend` directory and install the dependencies:

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root of the `frontend` directory and configure the backend API endpoint:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```
*(Make sure your local backend server is running on port 8000)*

### 3. Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🛠️ Project Structure

- `src/` - React components, hooks, and layout utilities.
- `public/` - Static assets and global resources.
- `package.json` - Project metadata and dependencies.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to explore the codebase and submit pull requests.

## 📝 License

This project is licensed under the MIT License.
