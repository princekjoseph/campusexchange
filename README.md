# 🎓 CampusExchange

A secure, hyperlocal student marketplace platform built to streamline the buying, selling, and giving away of campus essentials—from textbooks and lab gear to dorm accessories—within a verified university ecosystem.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonec2&logoColor=white)](https://aws.amazon.com/ec2/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-569A31?logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens)](https://jwt.io/)

---

## 📌 Features

- **Hyperlocal Campus Feed:** Filter listings by category (Textbooks, Electronics, Dorm, Free Giveaways).
- **Listing Lifecycle Management:** Dedicated student dashboard to post, mark as sold, or archive listings.
- **Secure Image Uploads:** Multi-image asset management powered directly via AWS S3.
- **Student Profile & Contact Control:** Controlled exposure of contact details to reduce unsolicited spam.
- **JWT-Protected Authentication:** Encrypted sessions and token verification for safe peer-to-peer exchanges.
- **Clean Dark-Mode UI:** High-contrast, distraction-free visual interface.

---

## 🏛️ System Architecture

```text
                        +----------------------+
                        |   Client Browser     |
                        +----------+-----------+
                                   |
                             (HTTP Port 80)
                                   v
             +---------------------------------------------+
             |             AWS EC2 Instance                |
             |                                             |
             |   +-------------------------------------+   |
             |   |            Docker Host              |   |
             |   |                                     |   |
             |   |  +-------------------------------+  |   |
             |   |  |   Node.js / Express Service   |  |   |
             |   |  +---------------+---------------+  |   |
             |   |                  |                  |   |
             |   |                  v (TCP 5432)       |   |
             |   |  +---------------+---------------+  |   |
             |   |  |     PostgreSQL Database       |  |   |
             |   |  +---------------+---------------+  |   |
             |   |                  |                  |   |
             |   |                  v                  |   |
             |   |     [Docker Named Volume Data]      |   |
             |   +-------------------------------------+   |
             +---------------------+-----------------------+
                                   |
                              (AWS SDK)
                                   v
                        +----------------------+
                        |     AWS S3 Bucket    |
                        |   (Listing Images)   |
                        +----------------------+
