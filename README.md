# CodeAlpha AI Chatbot

### An Intelligent, Full-Stack AI Chatbot Built with Java, Spring Boot & Groq API

A modern, responsive, and secure AI chatbot application developed as part of the **CodeAlpha Internship – Task 3**. The application integrates the Groq API to generate real-time AI responses and provides secure user authentication, personalized conversation management, and a clean, professional chat interface.

---

## Overview

CodeAlpha AI Chatbot is a full-stack web application designed to deliver an interactive AI-powered conversational experience.

Users can create an account, securely log in, interact with an AI assistant, manage their individual conversations, and delete chat history whenever needed.

The application combines a Java Spring Boot backend with a responsive frontend and a MySQL database to provide a structured and scalable foundation for an AI-powered chatbot.

## Key Features

- **AI-Powered Conversations:** Generates real-time responses using the Groq API.
- **User Authentication:** Secure user registration and login functionality.
- **JWT Security:** Token-based authentication for protected API endpoints.
- **Personalized Chat History:** Each user can access only their own conversations.
- **Conversation Management:** Create new conversations, view previous chats, and delete unwanted conversations.
- **Persistent Data Storage:** Stores user accounts and conversations in MySQL.
- **Responsive Interface:** Professional UI optimized for desktop, tablet, and mobile devices.
- **Light & Dark Themes:** Switch between light and dark appearance.
- **Markdown Support:** Renders formatted AI responses with support for code blocks and other Markdown elements.
- **Copy Responses:** Easily copy AI-generated messages.
- **Input Validation:** Validates incoming requests and handles invalid input.
- **Exception Handling:** Provides structured error handling for API requests.
- **Health Monitoring:** Spring Boot Actuator health endpoint for application monitoring.

## Technology Stack

| Category | Technologies |
|---|---|
| Backend | Java 21, Spring Boot |
| Frontend | HTML5, CSS3, JavaScript |
| AI Integration | Groq API |
| Database | MySQL |
| Authentication | Spring Security, JWT |
| Build Tool | Maven |
| API Communication | REST API, JSON |
| Frontend Libraries | Marked.js, DOMPurify |
| Monitoring | Spring Boot Actuator |
| Version Control | Git & GitHub |

## Application Architecture

The application follows a client-server architecture.

```text
                  USER
                    |
                    v
          RESPONSIVE WEB INTERFACE
             HTML / CSS / JS
                    |
                    v
              REST API
                    |
                    v
          SPRING BOOT BACKEND
                    |
          +---------+---------+
          |         |         |
          v         v         v
       Security  Chatbot   Exception
       & JWT     Service   Handling
                    |
             +------+------+
             |             |
             v             v
          MySQL         Groq API
          Database     AI Responses
```

## Project Structure

```text
CodeAlpha_AIChatbot/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/codealpha/chatbot/
│   │       │   ├── config/
│   │       │   ├── security/
│   │       │   ├── controller/
│   │       │   ├── dto/
│   │       │   ├── entity/
│   │       │   ├── repository/
│   │       │   ├── service/
│   │       │   └── ChatbotApplication.java
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Make sure the following software is installed:

- Java Development Kit (JDK) 21 or later
- MySQL Server
- Git
- A modern web browser
- Visual Studio Code (recommended)

You will also need a Groq API key.

### 1. Clone the Repository

```bash
git clone https://github.com/Manish9917/CodeAlpha_AIChatbot.git
```

Navigate to the project directory:

```bash
cd CodeAlpha_AIChatbot
```

### 2. Configure the Database

Start your MySQL server and create a database for the application.

Configure the database URL, username, and other required connection settings in:

```text
backend/src/main/resources/application.properties
```

The application uses environment variables for sensitive configuration values.

### 3. Configure Environment Variables

Set the following environment variables before starting the backend:

| Variable | Description |
|---|---|
| `DB_PASSWORD` | MySQL database password |
| `GROQ_API_KEY` | Groq API key for AI response generation |
| `JWT_SECRET` | Secret key used for JWT token signing |

**Important:** Never commit actual passwords, API keys, JWT secrets, or other sensitive credentials to GitHub.

### 4. Run the Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

On Windows PowerShell:

```powershell
.\mvnw.cmd clean package
```

Start the Spring Boot application:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend will start at:

```text
http://localhost:8080
```

### 5. Run the Frontend

Open the `frontend` folder in Visual Studio Code.

Use the Live Server extension to launch:

```text
frontend/index.html
```

The frontend is configured to communicate with the backend API running on:

```text
http://localhost:8080
```

Open the application in your browser using the local URL provided by Live Server.

## API Endpoints

The backend exposes the following REST API endpoints:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate an existing user |
| POST | `/api/chat` | Send a message and receive an AI response |
| GET | `/api/conversations` | Retrieve authenticated user's conversations |
| GET | `/api/conversations/{id}/messages` | Retrieve messages from a conversation |
| DELETE | `/api/conversations/{id}` | Delete a conversation and its messages |
| GET | `/actuator/health` | Check application health |

**Note:** Protected endpoints require a valid JWT authentication token.

## Security

Security is an important part of this application.

- JWT-based authentication protects user-specific endpoints.
- Spring Security manages access to protected resources.
- Passwords are securely hashed before storage.
- Conversation access is restricted to the authenticated user.
- Sensitive configuration values are supplied through environment variables.
- Input validation and exception handling help protect API operations.

## Future Enhancements

Potential improvements for future versions include:

- Cloud deployment and production hosting.
- Automated backend and frontend testing.
- Docker-based application deployment.
- Additional AI model integrations.
- Streaming AI responses.
- Advanced conversation search and organization.

## Learning Outcomes

Through this project, I gained practical experience in:

- Developing REST APIs using Java and Spring Boot.
- Integrating external AI services through API requests.
- Implementing JWT authentication and Spring Security.
- Connecting a backend application with MySQL.
- Building responsive frontend interfaces.
- Managing user-specific application data.
- Handling validation, exceptions, and application monitoring.
- Using Git and GitHub for version control.

## Author

**Manish Maurya**

Aspiring Full-Stack Developer | Java & Spring Boot Enthusiast

Interested in building scalable backend systems, modern web applications, and practical software solutions.

---

## Acknowledgements

Developed as part of the **CodeAlpha Internship Program – Task 3**.

**If you find this project interesting, consider giving it a ⭐ on GitHub!**