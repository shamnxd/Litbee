# Litbee - URL Shortener

Litbee is a full-stack, scalable URL shortening application. Built with modern web technologies, it provides a seamless user experience for creating, managing, and tracking shortened URLs. 

## 🚀 Tech Stack

### Frontend (Client)
- **Framework**: React 19 / Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4) with Shadcn UI & Radix UI
- **State Management**: Redux Toolkit (RTK)
- **Routing**: React Router DOM
- **Authentication**: Google OAuth integration (`@react-oauth/google`)
- **Features**: QR code generation for shortened links (`qrcode.react`)

### Backend (Server)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Security & User Auth**: JWT (JSON Web Tokens), Passport, Bcrypt, Google Auth Library
- **Validation**: class-validator, class-transformer

## 📁 Project Structure

This repository contains both the client and server code, logically divided into two environments:
- `client/` - Contains the React Vite frontend application.
- `server/` - Contains the NestJS backend API.

## ⚙️ Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or above recommended)
- [pnpm](https://pnpm.io/) (Package manager used for this project)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas cluster)

## 🛠️ Setup Instructions

### 1. Database Setup
Ensure you have a MongoDB instance running. If using a local instance, it typically runs on `mongodb://localhost:27017/`.

### 2. Backend (Server) Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Copy the example environment file and create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and configure the necessary variables (update the secret/database details as needed):
   ```env
   MONGODB_URI=mongodb://localhost:27017/Litbee
   JWT_SECRET=your_super_secret_key_change_this_in_production
   JWT_REFRESH_SECRET=your_super_refresh_secret_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   PORT=3000
   FRONTEND_URL=http://localhost:5174
   SHORT_URL_BASE=http://localhost:5174
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your_smtp_email@gmail.com
   SMTP_PASS=your_smtp_app_password
   REDIS_URL="redis://your_redis_connection_string_here"
   ```

4. Run the API Server:
   ```bash
   # Development watch mode
   pnpm run start:dev
   ```
   The backend will be live at `http://localhost:3000`.

### 3. Frontend (Client) Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `client` root directory:
   ```bash
   # .env
   VITE_API_URL=http://localhost:3000/api
   VITE_SHORT_URL_BASE=http://localhost:5174
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```

4. Run the Client Web App:
   ```bash
   pnpm run dev
   ```
   The frontend will be accessible at `http://localhost:5174` (or the port specified by Vite in the terminal).

## 🧑‍💻 Usage

1. Open your browser and navigate to the client URL.
2. Register or Login using your standard email/password or log in seamlessly with Google OAuth.
3. Paste a long URL into the provided dashboard to generate a shortened Litbee link.
4. Export or share the link, or download the automatically generated QR code!

## 📜 License
This project is proprietary and confidential. All rights reserved.
