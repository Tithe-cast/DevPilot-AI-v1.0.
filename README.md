# DevPilot-AI-v1.0

DevPilot AI is an AI-powered software engineering workspace designed to assist developers throughout the software development lifecycle. The platform provides code review, bug fixing, documentation generation, smart project recommendations, and a context-aware chat assistant.

---

## 🚀 Key Features

*   **AI Code Reviewer**: Paste source code and receive design improvements, performance optimization tips, safety audits, and a fully refactored script.
*   **AI Bug Fix Assistant**: Analyze compiler logs or stack traces to identify root causes and output suggested fixes and preventive guidelines.
*   **AI README Generator**: Input project metadata to compile a professional, clean, markdown-formatted `README.md`.
*   **Smart Project Recommendations**: Receive architectural suggestions, package setups, folder structures, database recommendations, and deployment blueprints suited to your project.
*   **Context-Aware Chat**: Converse with an AI assistant that references the specific parameters of your active developer project.
*   **Developer Dashboard & Analytics**: Access charts showing weekly requests, most used AI tools, and catalog metrics.
*   **Custom API Key Settings**: Users can input their own Gemini API keys directly in the frontend UI settings. If no key is configured, a high-fidelity local simulator runs automatically to guarantee full functionality out of the box.

---

## 📁 Repository Structure

```
DevPilot AI v1.0/
├── backend/            # Express.js, TypeScript, and JWT-auth service
│   ├── src/db/db.ts    # Robust file-based mock MongoDB CRUD engine
│   └── src/server.ts   # Express server initialization
├── frontend/           # Vite, React, TypeScript, and Tailwind UI
│   ├── src/App.tsx     # Single Page Application router and core shell
│   └── vercel.json     # Production API rewrite routing for Vercel
└── package.json        # Root scripts to run backend and frontend concurrently
```

---

## 💻 Local Setup & Execution

### 1. Install Dependencies
Run the install command from the root workspace directory to set up both projects:
```bash
npm run install-all
```

### 2. Run the Development Servers
Start both the backend API and frontend development servers concurrently:
```bash
# Run both servers
npm run dev-backend & npm run dev-frontend
```
- **Backend API**: Running at [http://localhost:5000](http://localhost:5000)
- **Frontend Client**: Running at [http://localhost:3000](http://localhost:3000)

### 3. Demo Credentials
Log in with the preloaded developer seed account:
- **Email**: `demo@devpilot.ai`
- **Password**: `password123`

---

## 📦 Building for Production

Compile both backend and frontend applications to their respective production builds:
```bash
npm run build-all
```

---

## 🌐 Deployment

### Backend (Render)
1. Set up a **Web Service** on Render.
2. Build command: `cd backend && npm install && npm run build`
3. Start command: `cd backend && npm run start`
4. Add environment variables: `JWT_SECRET`, `GEMINI_API_KEY` (optional).
5. Attach a **Persistent Disk** mounted at `/backend/data` (Size: `1 GB`) to persist the JSON database file (`db.json`).

### Frontend (Vercel)
1. Link your repository to a new project in Vercel.
2. Set the root directory to `frontend`.
3. Vercel will auto-detect Vite. The pre-packaged `vercel.json` will automatically rewrite `/api/*` requests to your live Render backend URL.
