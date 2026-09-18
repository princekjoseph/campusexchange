# CampusExchange 🎓

A modern, dark-themed peer-to-peer marketplace tailored for university students to sell, exchange, or pass down campus essentials (textbooks, electronics, lab supplies).

## 🚀 Live Demo
- **URL:** `http://43.204.211.94`

---

## 🏗️ Architecture & AWS Cloud Design

CampusExchange is deployed on AWS infrastructure utilizing containerized micro-services:

- **Amazon EC2 (`t2.micro` / Ubuntu LTS):** Compute host running containerized backend services.
- **Docker & Docker Compose:** Orchestrates multi-container architecture (Node.js App + PostgreSQL).
- **Amazon S3:** Object storage bucket configured with public-read policy for item images.
- **PostgreSQL 15:** Relational database with automated schema bootstrapping and persistent EBS volume mounts.
- **AWS IAM:** Principle of least privilege (PoLP) credential management for AWS SDK integrations.
- **AWS VPC & Security Groups:** Configured inbound firewall rules controlling TCP ports 22 (SSH), 80 (HTTP), and 5000.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (via `pg` connection pool)
- **Frontend / UI:** EJS templates styled with Tailwind CSS (Dark monochrome theme)
- **Authentication:** JWT (JSON Web Tokens) stored in secure HTTP-only cookies + `bcryptjs` password hashing
- **File Processing:** `multer` with direct streaming via `@aws-sdk/client-s3`

---

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/](https://github.com/)<YOUR_GITHUB_USERNAME>/campusexchange.git
   cd campusexchange
