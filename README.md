# 🧭 FindZone — Campus Lost & Found System

A full-stack **Lost and Found Management System** built as part of a DBMS mini project using **Next.js**, **MySQL**, and **Prisma**.  
FindZone helps students efficiently report, search, and recover lost or found items on campus with secure OTP-based verification.

---

## 🚀 Features

- 🔐 Student authentication using **USN and Date of Birth**
- 📝 Report **Lost** and **Found** items
- 🔍 Smart item search by:
  - Item name
  - Category
  - Description
- 📬 OTP-based item return verification via email
- 🗂️ Personalized **My Reports** dashboard
- 🎨 Responsive modern UI using **Tailwind CSS** and **shadcn/ui**
- 🐳 Fully **Dockerized** application
- ⚡ Automated **CI/CD pipeline** using **GitHub Actions**
- ☁️ Ready for cloud deployment

---

## 🛠️ Tech Stack

| Layer         | Technology |
|---------------|------------|
| Frontend      | Next.js (App Router) |
| Styling       | Tailwind CSS, shadcn/ui |
| Backend       | Node.js with Next.js API Routes |
| Database      | MySQL + Prisma ORM |
| Authentication| USN + DOB based login |
| Email Service | Nodemailer + Gmail SMTP |
| DevOps        | Docker, GitHub Actions |
| Deployment    | Vercel / Railway / Render |

---

## 🐳 Docker Support

The project is fully containerized using Docker.

### Build Docker Image
```bash
docker build -t findzone .
