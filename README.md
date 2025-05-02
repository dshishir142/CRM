📇 Personal CRM System: 

A modern, dark-themed Customer Relationship Management (CRM) system built for agents and admins to manage clients, track communications, automate reminders, and enrich contact data. Designed for performance, usability, and productivity.

🚀 Features

- 👤 Client Management – Add, edit, and delete clients with profile images.

- 🗒️ Interaction Logging – Track meetings, calls, and other touchpoints.

- 📧 Email Module – Send and review client emails.

- 📊 Interest Scoring – Auto-assess client engagement (read-only field).

- 🔔 Smart Notifications – Scheduled follow-up reminders via WebSockets.

- 🔍 Data Enrichment – Pull social/professional info using Hunter.io API.
  
- 🖼️ Image Upload & Hosting – Dedicated image server (imageLoader).

- 🎨 Dark Theme UI – Clean and accessible modern design.

- 🔒 Role-Based Views – Separate panels for agents and admins.

⚠️ Note: Visualization dashboard and email tracking via pixel embedding are still under development.


🛠️ Tech Stack
Frontend:
- React.js, React Router

- Axios, React-Toastify

- CSS Modules

Admin Panel:
- Separate React app for admin users

- Role-specific views & management tools

Backend:
- Node.js + Express.js

- Prisma ORM + MySQL

- WebSocket (ws)

Image Hosting:
- imageLoader (Express server)

- Handles image uploads

- Serves static images via URL

Integrations:
- Hunter.io API (for data enrichment)

- (Email tracking pixel integration – coming soon)


📦 Installation
1. Clone the repository
    ```
    git clone https://github.com/yourusername/crm-project.git
    cd crm-project
    ```

2. Install Dependencies
    ```
    # Backend
    cd backend
    npm install

    # Frontend
    cd ./frontend
    npm install

    # Admin Panel
    cd ./admin
    npm install

    # Image Upload Server
    cd ./imageLoader
    npm install
    ```

3. Environment Setup
   Backend .env
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/crm
   HUNTER_API_KEY=your_hunter_api_key
   ```

4. Set Up Prisma
   ```
   cd backend
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Run All Servers
    ```
    # Start Backend API
    cd backend
    npm run dev

    # Start Frontend (Agent Panel)
    cd ../frontend
    npm run dev

    # Start Admin Panel
    cd ../admin
    npm run dev

    # Start Image Upload Server
    cd ../imageLoader
    npm start
    ```
