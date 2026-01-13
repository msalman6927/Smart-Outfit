# Smart Outfit: AI-Powered Wardrobe Recommendation System

[![Powered by FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Frontend Vanilla](https://img.shields.io/badge/Frontend-Vanilla_JS/CSS/HTML-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Database SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

**Smart Outfit** is a full-stack, production-ready web application designed to simplify daily decision-making by recommending the optimal outfit based on a user’s personal wardrobe and real-time (or simulated) weather conditions. Built with a focus on clean architecture and scalable backend practices, it serves as a robust demonstration of modern web engineering.

---

## 🚀 Key Features

- **Personalized Outfit Logic**: Intelligent matching algorithm that selects clothing items based on temperature ranges and weather conditions (Cloudy, Sunny, etc.).
- **Dynamic Wardrobe Management**: Full CRUD capabilities for managing categories (Top, Bottom, Shoes, Outerwear) with an intuitive interface.
- **Secure Authentication**: Implementation of OAuth2 with JWT Bearer tokens for secure session management.
- **Responsive Dashboard**: A premium, "glassmorphism" styled UI that ensures a seamless experience across desktop and mobile devices.
- **Extensible Weather Service**: Modular service architecture allowing for easy swapping between live API data and stable mock environments.

---

## 🏗️ Architecture Overview

The project adheres to a strict separation of concerns, ensuring maintainability and scalability.

- **Backend (RESTful API)**: Built with **FastAPI**. It leverages **SQLAlchemy ORM** for database interactions and **Pydantic** for data validation and serialization.
- **Frontend (SPA)**: A lightweight Single Page Application using **Vanilla JavaScript**. It interacts with the backend via asynchronous `fetch` calls, managing state and authentication tokens in local storage.
- **Data Layer**: A persistent **SQLite** database stores user profiles, wardrobe items, and relationship mappings.

---

## 🛡️ Security Implementation

- **Password Hashing**: User passwords are never stored in plain text. They are hashed using **Bcrypt** with a random salt.
- **JWT Authentication**: Secure token-based authentication with expiration limits (Access Tokens).
- **CORS Protection**: Configured middleware to prevent unauthorized cross-origin requests.

---

## ⚙️ Local Development Setup (Windows)

### 1. Prerequisites
- **Python 3.9 - 3.12** installed.
- Access to a terminal (PowerShell or Command Prompt).

### 2. Backend & Virtual Environment
From the project root directory:
```powershell
# Create virtual environment inside backend folder
python -m venv backend/venv

# Activate the virtual environment
.\backend\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Application Startup
The project includes a root-level proxy for convenience:
```powershell
# Start the backend (Port 8000)
uvicorn app.main:app --reload

# Start the frontend (Port 3000) - Open a new terminal
python -m http.server 3000 --directory frontend
```

---

## 🌤️ Weather Integration Note

For demonstration stability and recruiter review, the weather service currently defaults to a **Mocked Environment (15°C, Cloudy)**. 
- **Why?** This ensures the "Outfit Logic" is always testable without relying on external API rate limits or fluctuating real-time temperatures that might not trigger all clothing categories.
- **API Ready**: To enable live data, simply provide an `OPENWEATHER_API_KEY` in the `.env` file and toggle the service configuration.

---

## 📸 Screenshots
*(Add your project screenshots here to wow recruiters!)*

| Login Screen | Dashboard | Wardrobe Management |
| :--- | :--- | :--- |
| ![Login Placeholder](https://via.placeholder.com/300x200?text=Login+UI) | ![Dashboard Placeholder](https://via.placeholder.com/300x200?text=Dashboard+UI) | ![Wardrobe Placeholder](https://via.placeholder.com/300x200?text=Wardrobe+Management) |

---

## 📈 Future Improvements

- [ ] **Image Uploads**: Integration with AWS S3 or Cloudinary for actual clothing photos.
- [ ] **AI Styling**: Using OpenAI API to generate style tips for the recommended outfits.
- [ ] **Dockerization**: Containerizing the app for one-click deployment to AWS/Heroku.
- [ ] **Global State**: Transitioning to a state management library for more complex UI flows.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Created for portfolio demonstration by [Your Name]. Feel free to connect on [LinkedIn]!*
