# 🧭 Lost and Found System

A full-stack **Lost and Found Management System** built as part of a DBMS mini project using **Next.js**, **MySQL**, and **Prisma**. This system helps students efficiently report and find lost or found items on campus, with OTP-based item verification.

---

## 📌 Features

- 🔐 Student login and registration using **USN and Date of Birth**
- 📝 Report **lost or found items**
- 🔍 **Search** for lost items by name, category, or description
- 📬 OTP-based **verification via email** before returning items
- 🗂️ **My Reports** dashboard to manage submitted items
- 🎨 Modern, responsive UI using **Tailwind CSS** and **shadcn/ui**

---

## ⚙️ Tech Stack

| Layer         | Technology                  |
|---------------|-----------------------------|
| Frontend      | Next.js (App Router)        |
| Styling       | Tailwind CSS, shadcn/ui     |
| Backend       | Node.js with Next.js API    |
| Database      | MySQL with Prisma ORM       |
| Email Service | Nodemailer + Gmail SMTP     |
| Deployment    | Vercel (frontend), Railway/XRender (optional backend)

---

## 🏁 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/DBMS-project.git
cd DBMS-project
