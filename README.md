# 🚀 DevPilot AI v1.0

DevPilot AI is a professional, AI-powered software engineering workspace designed to assist developers throughout the software development lifecycle. The platform provides automated code review, bug fixing, documentation generation, smart project recommendations, analytics, and a context-aware chat assistant.

---

## 🌟 Key Features

*   **🤖 AI Code Reviewer**: Paste source code to receive design improvements, performance optimization tips, safety audits, and a fully refactored script.
*   **🐛 AI Bug Fix Assistant**: Analyze compiler logs or stack traces to identify root causes and output suggested fixes and preventive guidelines.
*   **📄 AI README Generator**: Compile a professional, clean, markdown-formatted `README.md` with adjustable length (Short, Medium, Long) and custom styling templates (Standard, Minimalist, Academic).
*   **💡 Smart Project Recommendations**: Receive architectural suggestions, folder structures, packages, database recommendations, and deployment blueprints suited to your project.
*   **💬 Context-Aware Chat**: Converse with an AI assistant that references the specific parameters of your active developer project.
*   **📊 Developer Dashboard & Analytics**: Access charts showing weekly requests, most used AI tools, and catalog metrics.
*   **🔑 Custom API Key Settings**: Input your own Gemini API key directly in the UI settings. If no key is configured, a high-fidelity local simulator runs automatically to guarantee full functionality out of the box.
*   **🌍 Public Details Page**: Allow visitors to view project details publicly without authentication (while hiding editing and AI actions for anonymous users).
*   **⚡ Modern Listing Experience**: Projects listing features client-side pagination (8 cards per page) with glassmorphic controls and responsive skeleton loaders.
*   **🖼️ Optional Cover Images**: Customize project cards with optional image URLs (falling back to generative gradients).

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Vite, React, TypeScript
- **State & Data Fetching**: TanStack Query (`@tanstack/react-query`)
- **Styling**: Tailwind CSS, Lucide icons, glassmorphic card designs
- **Analytics & Graphs**: Recharts
- **Authentication**: JWT local storage & Google OAuth 2.0 (implicit client flow)

### Backend
- **Server**: Node.js, Express.js, TypeScript
- **Database Engine**: Hybrid Mongoose / MongoDB connection with automated JSON file fallback
- **Authentication**: JWT token validation middleware

---

## 📁 Repository Structure

```
DevPilot AI v1.0/
├── backend/                  # Express.js, TypeScript, and JWT-auth service
│   ├── src/db/db.ts          # Hybrid Mongoose & mock-JSON CRUD database wrapper
│   ├── src/controllers/      # Auth, AI (Gemini integration), and Project controllers
│   └── src/server.ts         # Express server initialization & routes configuration
├── frontend/                 # Vite, React, TypeScript, and Tailwind UI
│   ├── src/App.tsx           # Application root shell, routing, and configurations
│   ├── src/pages/            # Dashboard, Workspace, Projects, Profile, and Public views
│   └── vercel.json           # Production API rewrite routing for Vercel
└── package.json              # Root npm scripts for concurrent development & builds
```

### 3. Demo Credentials
Log in with the preloaded developer seed account:
- **Email**: `demo@devpilot.ai`
- **Password**: `password123`

---
