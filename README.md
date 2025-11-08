# 🫀 LifeLink (OrganLink-Aid)

![License](https://img.shields.io/github/license/Paarth01/organlink-aid?color=blue)
![GitHub repo size](https://img.shields.io/github/repo-size/Paarth01/organlink-aid)
![GitHub stars](https://img.shields.io/github/stars/Paarth01/organlink-aid?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/Paarth01/organlink-aid)
![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-blue)

---

## 🧠 Project Description

**LifeLink (OrganLink-Aid)** is a full-stack organ donation management system that bridges the gap between **donors**, **recipients**, and **medical authorities**.  
It enables hospitals to manage organ availability, patient matching, and donor data in real-time — ensuring faster, transparent, and more efficient organ transplantation processes.

---

## 🌟 Key Features

- 🩸 **Donor Registration** – Register and maintain organ donor details securely  
- 🧬 **Recipient Matching System** – Match donors with compatible recipients using smart algorithms  
- 🕓 **Real-Time Database Updates** – Supabase Realtime for automatic data synchronization  
- 🔐 **User Authentication** – Secure login for users, hospitals, and authorities  
- 🧾 **Donation History** – Track past transplants and available organs  
- 💬 **Notifications & Alerts** – Instant updates on matches and status changes  
- 📊 **Dashboard** – Overview of donors, recipients, and organ requests  

---

## 🏗️ Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | React (Vite) • TypeScript • Tailwind CSS • shadcn/ui |
| **Backend** | Supabase (PostgreSQL • Auth • Realtime) |
| **Deployment** | Vercel / Netlify |
| **Version Control** | Git + GitHub |

---

## 📁 Folder Structure
```bash
organlink-aid/
│
├── src/ # Source code
│ ├── components/ # Reusable UI components
│ ├── pages/ # Page-level React components
│ ├── hooks/ # Custom React hooks
│ ├── utils/ # Helper and utility functions
│ └── assets/ # Images, icons, and static files
│
├── supabase/ # Backend configuration and SQL
├── public/ # Public assets
├── .env.example # Environment variable sample
├── package.json # Dependencies and scripts
└── vite.config.ts # Vite build configuration
```

---

## ⚙️ Installation & Setup

### 🧾 Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### 🪜 Steps

```bash
# Clone the repository
git clone https://github.com/Paarth01/organlink-aid.git

# Navigate into the project directory
cd organlink-aid

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Supabase credentials to the .env file
# Example:
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start the development server
npm run dev
```
---

## 🧠 Future Enhancements
- 🤖 AI-based Matching – Use ML models for better donor–recipient compatibility
- 🛰️ Hospital API Integration – Link with external hospital systems
- 📱 PWA Support – Access as a progressive web app
- 📊 Analytics Dashboard – Monitor real-time stats and trends
- 🌍 Multi-language Support – Global accessibility

---

## 🙌 Acknowledgments
- Supabase – backend and database services
- Tailwind CSS – modern utility-first CSS framework
- shadcn/ui – accessible React components
- Vite – lightning-fast frontend build tool

---
