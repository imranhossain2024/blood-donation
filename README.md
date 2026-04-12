# 🩸 Blood Donation Web App

A modern, full-stack blood donation management system connecting donors with those in need. Built with Next.js 14, this application features a role-based architecture facilitating seamless interaction between Users, Donors, Agents, and Administrators.

![Project Banner](https://via.placeholder.com/1200x400?text=Blood+Donation+Platform)
_(Replace with actual project screenshot)_

## ✨ Features

- **🩸 Donor Management**: Users can register as donors, manage their profiles, and update availability status.
- **🔍 Advanced Search**: Find donors by blood group, location, and availability.
- **👨‍💼 Agent Dashboard**: Dedicated area-based agents to verify and manage donors in their specific regions.
- **🛡️ Admin Panel**: Comprehensive control over users, roles, and system-wide settings.
- **🔐 Role-Based Access**: Secure authentication and authorization for Users, Donors, Agents, and Admins.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📂 Folder Structure

```bash
blood-donation/
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages & API routes
│   │   ├── (auth)/       # Authentication routes
│   │   ├── dashboard/    # Protected User/Admin/Agent dashboards
│   │   └── api/          # Backend API endpoints
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and configurations
│   ├── scripts/          # Admin/Dev scripts (e.g., seeding, role promo)
│   └── types/            # TypeScript type definitions
└── ...config files
```

## 🚀 Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/blood-donation.git
    cd blood-donation
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory by copying the example:

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your credentials:

    ```env
    # Database (PostgreSQL connection string)
    DATABASE_URL="postgresql://user:password@localhost:5432/blood_donation?schema=public"

    # NextAuth Configuration
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"
    ```

4.  **Database Setup:**
    ```bash
    pnpm prisma generate
    pnpm prisma db push
    ```

## 🏃‍♂️ Running Locally

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔑 User Roles

| Role      | Description                                                                |
| :-------- | :------------------------------------------------------------------------- |
| **USER**  | Standard user. Can request blood and view generic info.                    |
| **DONOR** | Registered donor. Can be searched and contacted after verification.        |
| **AGENT** | Area manager. Verifies donors and manages requests in their assigned zone. |
| **ADMIN** | Superuser. Full access to all system resources and user management.        |

## 🌐 API Routes

The application exposes several API endpoints for frontend interaction:

- `GET /api/donors` - Fetch list of donors (filtered).
- `POST /api/request` - Create a new blood request.
- `PATCH /api/agent/verify-donor` - Approve a donor profile (Agent only).
- `POST /api/auth/register` - User registration.

## 📦 Deployment

The easiest way to deploy is using **Vercel**:

1.  Push your code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add the **Environment Variables** (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.) in Vercel settings.
4.  Click **Deploy**.

For detailed deployment steps, refer to [Vercel Deployment Documentation](https://nextjs.org/docs/deployment).

## 🤝 Contribution

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Made with ❤️ by [Imran Hossain]
