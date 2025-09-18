🌍 CSD G6 Project – Tariff Calculator
📖 Overview

This project helps technology hardware companies simplify and automate tariff calculations for products such as CPUs, GPUs, and consumer electronics.
The app supports trade flows (starting with Singapore ↔ United States) and provides accurate landed cost estimates using tariff data.

# 🚀 Tech Stack

- Backend: Spring Boot, Spring Security (JWT), Swagger UI
- Database: PostgreSQL (Supabase)
- Frontend: React + TailwindCSS (Vercel(?) deploy)
- Deployment: Render / Railway for backend, Vercel for frontend

# ⚡ Features
🔐 User Auth – Register, Login, JWT-based security
📦 Products CRUD – Manage hardware products + HS codes
💰 Tariff Calculator – Estimate duties between countries (SG ↔ US first)
📜 History – Save & view past calculations
📊 (Optional) Visualization – Charts, comparisons, what-if simulator
🗄️ Database Schema (Simplified)
- users – id, email, password_hash
- products – id, name, hs_code, category
- tariffs – id, origin_country, dest_country, hs_code, rate
- calculations – id, user_id, product_id, value, duty, total_cost, timestamp

🧑‍💻 Getting Started
# Backend Setup

# Clone repo
git clone https://github.com/your-org/your-repo.git
cd your-repo/backend

# Run Spring Boot (Java 17+ required)
./mvnw spring-boot:run

# Backend will run at: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html

# FrontEnd Setup
cd frontend
npm install
npm run dev

<!-- # 🤝 Contribution Guide

We use feature branches + pull requests.
👉 See CONTRIBUTING.md
 for full details. -->

# Quick Workflow

# Always pull latest main
git checkout main
git pull origin main

# Create new branch
git checkout -b feature/my-task-name

# Work, commit, push
git add .
git commit -m "Implement tariff calculation endpoint"
git push origin feature/my-task-name

# Open PR on GitHub and request review


# 📌 Pull Requests

All PRs must use our PR Template.
At least 1 reviewer approval required.
Use Squash & Merge only.
Delete branch after merge.

# Useful commands

# Switch branches
git checkout branch-name

# Delete local branch
git branch -d feature/my-task-name

# Delete remote branch
git push origin --delete feature/my-task-name


# Team Roles

(to be added)