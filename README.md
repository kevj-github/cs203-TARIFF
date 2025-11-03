# CSD G5 Group 6 Project – Tariff Calculator

## Overview
This project helps technology hardware companies simplify and automate tariff calculations for products such as CPUs, GPUs, and consumer electronics.  

- Supports trade flows (starting with **Singapore ↔ United States**)  
- Provides accurate **landed cost estimates** using tariff data  

---

## Tech Stack
- **Backend:** Spring Boot, Spring Security (JWT), Swagger UI  
- **Database:** PostgreSQL (Supabase)  
- **Frontend:** React + TailwindCSS (to be implemented AWS deploy)  
- **Deployment:** Deployed Locally, Vite (frontend)  

---

## Features
- **User Auth** – Register, Login, JWT-based security  
- **Products CRUD (Through API)** – Manage hardware products + HS codes  
- **Tariff Calculator** – Estimate duties (SG ↔ US first)  
- **Visualization (Dashboard)** – Charts, comparisons, what-if simulator  

---

## Database Schema (Simplified)

| Table        | Columns                                                                 |
|--------------|-------------------------------------------------------------------------|
| **users**    | id, email, password_hash                                                 |
| **products** | id, name, hs_code, category                                              |
| **tariffs**  | id, origin_country, dest_country, hs_code, rate                          |
| **calculations** | id, user_id, product_id, value, duty, total_cost, timestamp         |

---

## Getting Started

### Backend Setup
```bash
# Clone repo
git clone https://github.com/your-org/your-repo.git
cd your-repo/backend

# Run Spring Boot (Java 17+ required)
./mvnw spring-boot:run


# FrontEnd Setup
cd frontend
npm install
npm run dev

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
```

# Open PR on GitHub and request review

# Pull Requests

Pull Requests

All PRs must use our PR Template

At least 1 reviewer approval required

Use Squash & Merge only

Delete branch after merge

# Useful commands

| Action                  | Command                                         |
| ----------------------- | ----------------------------------------------- |
| Switch branches      | `git checkout branch-name`                      |
| Delete local branch | `git branch -d feature/my-task-name`            |
| Delete remote branch | `git push origin --delete feature/my-task-name` |


# Team Roles
Clemira - Scrum Master, Code Reviewer & Database Management
Calvin - Backend Logic
Daniella - Frontend Desgin
Kevin - Security & API Implementation
Liam - Database Research & Management
