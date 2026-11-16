# CodeAlpha AI Chatbot

### An Intelligent Full-Stack AI Chatbot Built with Java, Spring Boot & Groq API

A modern, secure, and responsive AI-powered chatbot application developed as part of the **CodeAlpha Internship – Task 3**.

CodeAlpha AI Chatbot combines a Java Spring Boot backend, a responsive web interface, JWT-based authentication, and the Groq API to deliver real-time AI conversations with personalized chat history.

\<p align="center">   \<a href="[https://codealphaaichatbot-frontend.vercel.app/](https://codealphaaichatbot-frontend.vercel.app/)">\<strong>Live Application\</strong>\</a>   &nbsp; • &nbsp;   \<a href="[https://github.com/Manish9917/CodeAlpha_AIChatbot](https://github.com/Manish9917/CodeAlpha_AIChatbot)">\<strong>GitHub Repository\</strong>\</a>   &nbsp; • &nbsp;   \<a href="[https://codealpha-ai-chatbot-backend.onrender.com/actuator/health](https://codealpha-ai-chatbot-backend.onrender.com/actuator/health)">\<strong>Backend Health\</strong>\</a> \</p>

---

## Overview

**CodeAlpha AI Chatbot** is a full-stack web application that provides users with an interactive AI-powered conversational experience.

Users can create an account, securely log in, communicate with an AI assistant, access their personal conversation history, and delete conversations whenever required.

The application follows a client-server architecture, using Java and Spring Boot for backend services, HTML, CSS, and JavaScript for the frontend, and a MySQL-compatible TiDB Cloud database for persistent data storage.

The Groq API powers AI-generated responses, while Spring Security and JWT provide authentication and authorization.

## Live Demo

| Component         | Deployment           | Link                                                                               |
| ----------------- | -------------------- | ---------------------------------------------------------------------------------- |
| Frontend          | Vercel               | [Open Application](https://codealphaaichatbot-frontend.vercel.app/)                |
| Backend           | Render               | [Backend Service](https://codealpha-ai-chatbot-backend.onrender.com)               |
| Health Monitoring | Spring Boot Actuator | [Health Status](https://codealpha-ai-chatbot-backend.onrender.com/actuator/health) |
| Source Code       | GitHub               | [View Repository](https://github.com/Manish9917/CodeAlpha_AIChatbot)               |

**Note:** The backend health endpoint provides application health information. The first request after an extended period of inactivity may take longer while the hosted backend starts up.

## Key Features

- **AI-Powered Conversations:** Generates intelligent, real-time responses using the Groq API.
- **User Authentication:** Secure registration and login functionality.
- **JWT-Based Security:** Protects authenticated API endpoints using JSON Web Tokens.
- **Personalized Chat History:** Users can access only their own conversations.
- **Conversation Management:** Create new chats, view previous conversations, and delete unwanted chat history.
- **Persistent Data Storage:** Stores user accounts, conversations, and messages in a MySQL-compatible database.
- **Responsive User Interface:** Optimized for desktop, tablet, and mobile devices.
- **Light & Dark Themes:** Switch between light and dark appearance.
- **Markdown Rendering:** Displays formatted AI responses, including code blocks and other Markdown elements.
- **Copy Responses:** Copy AI-generated messages conveniently.
- **Input Validation:** Validates incoming requests to prevent invalid data.
- **Centralized Exception Handling:** Provides structured handling of application errors.
- **Health Monitoring:** Exposes a Spring Boot Actuator endpoint to monitor application health.

## Technology Stack

| Category             | Technologies                  |
| -------------------- | ----------------------------- |
| Programming Language | Java 21                       |
| Backend Framework    | Spring Boot                   |
| Frontend             | HTML5, CSS3, JavaScript       |
| AI Integration       | Groq API                      |
| AI Model             | OpenAI GPT-OSS 20B (via Groq) |
| Database             | TiDB Cloud (MySQL-compatible) |
| Authentication       | Spring Security, JWT          |
| Password Security    | BCrypt                        |
| API Architecture     | REST API, JSON                |
| Build Tool           | Maven                         |
| Frontend Libraries   | Marked.js, DOMPurify          |
| Monitoring           | Spring Boot Actuator          |
| Version Control      | Git, GitHub                   |
| Backend Hosting      | Render                        |
| Frontend Hosting     | Vercel                        |

## Application Architecture

The application follows a client-server architecture in which the frontend communicates with the Spring Boot backend through REST APIs.

```text
                    USER
                      |
                      v
             RESPONSIVE FRONTEND
                HTML / CSS / JS
                      |
                      v
                  REST API
                      |
                      v
             SPRING BOOT BACKEND
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
       Security    Chatbot    Exception
        & JWT      Service    Handling
                      |
               +------+------+
               |             |
               v             v
          TiDB Cloud       Groq API
          Database        AI Responses
```

### Request Flow

1. The user interacts with the web interface.
2. The frontend sends HTTP requests to the backend REST API.
3. Spring Security validates authentication where required.
4. The backend processes the request and communicates with the database or Groq API.
5. The generated response is returned to the frontend.
6. The conversation is stored and associated with the authenticated user.

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
│   │       │   ├── dto/
│   │       │   ├── entity/
│   │       │   ├── repository/
│   │       │   ├── service/
│   │       │   ├── AuthController.java
│   │       │   ├── ChatbotController.java
│   │       │   ├── GlobalExceptionHandler.java
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
├── Dockerfile
├── .gitignore
└── README.md
```

## Getting Started

Follow the instructions below to run the application locally.

### Prerequisites

Make sure the following tools and services are available:

- Java Development Kit (JDK) 21 or later
- Git
- A modern web browser
- Visual Studio Code (recommended)
- A TiDB Cloud or compatible MySQL database
- A Groq API key

### 1. Clone the Repository

Open a terminal and execute:

```bash
git clone https://github.com/Manish9917/CodeAlpha_AIChatbot.git
```

Navigate to the project directory:

```bash
cd CodeAlpha_AIChatbot
```

### 2. Configure the Database

Create or configure a MySQL-compatible database for the application.

Update the database connection settings in:

```text
backend/src/main/resources/application.properties
```

Configure the database URL and username according to your database provider.

### 3. Configure Environment Variables

The application uses environment variables to protect sensitive configuration values.

Configure the following variables before starting the backend:

| Variable       | Description                            |
| -------------- | -------------------------------------- |
| `DB_PASSWORD`  | Database password                      |
| `GROQ_API_KEY` | API key used for Groq AI integration   |
| `JWT_SECRET`   | Secret key used for signing JWT tokens |

Ensure that the database URL and username are also configured correctly in `application.properties`.

**Important Security Practices:**

- Never commit passwords, API keys, or JWT secrets to GitHub.
- Do not expose sensitive credentials in screenshots or logs.
- Use strong secret values and environment variables for configuration.
- Keep your local configuration secure.

### 4. Run the Backend

Open a terminal and navigate to the backend directory:

```powershell
cd backend
```

Build the application:

```powershell
.\mvnw.cmd clean package
```

Start the Spring Boot application:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend will be available at:

```text
http://localhost:8080
```

Check the application health:

```text
http://localhost:8080/actuator/health
```

### 5. Run the Frontend

Open the `frontend` folder in Visual Studio Code.

Install and use the **Live Server** extension to launch:

```text
frontend/index.html
```

For local development, ensure that the API base URL in `frontend/script.js` points to your local backend:

```javascript
const API_BASE_URL = "http://localhost:8080";
```

Open the local URL provided by Live Server in your browser.

**Note:** The deployed frontend is configured to communicate with the hosted backend. Change the API URL only when running the frontend against your local backend.

## API Endpoints

The Spring Boot backend exposes the following REST API endpoints:

| HTTP Method | Endpoint                           | Description                                     |
| ----------- | ---------------------------------- | ----------------------------------------------- |
| POST        | `/api/auth/register`               | Register a new user                             |
| POST        | `/api/auth/login`                  | Authenticate an existing user                   |
| POST        | `/api/chat`                        | Send a message and receive an AI response       |
| GET         | `/api/conversations`               | Retrieve the authenticated user's conversations |
| GET         | `/api/conversations/{id}/messages` | Retrieve messages from a conversation           |
| DELETE      | `/api/conversations/{id}`          | Delete a conversation and its messages          |
| GET         | `/actuator/health`                 | Check application health                        |

**Authentication:** Protected endpoints require a valid JWT token in the request's Authorization header.

```http
Authorization: Bearer <JWT_TOKEN>
```

## Security

Security and data isolation are important aspects of this application.

- **JWT Authentication:** Secures protected API endpoints.
- **Spring Security:** Manages authentication and authorization.
- **Password Hashing:** Uses BCrypt for secure password storage.
- **User-Specific Data Access:** Restricts conversation access to the authenticated user.
- **Environment-Based Configuration:** Keeps sensitive credentials outside the source code.
- **Input Validation:** Validates incoming API requests.
- **Centralized Error Handling:** Provides consistent handling of application exceptions.

## Deployment

The application is deployed using cloud hosting services.

| Component   | Platform   |
| ----------- | ---------- |
| Frontend    | Vercel     |
| Backend     | Render     |
| Database    | TiDB Cloud |
| Source Code | GitHub     |

The frontend communicates with the deployed Spring Boot backend through HTTPS-based REST API requests.

Sensitive deployment configuration is maintained through environment variables rather than hardcoded credentials.

## Learning Outcomes

Developing this project provided practical experience in:

- Building RESTful APIs using Java and Spring Boot.
- Integrating third-party AI services through API requests.
- Implementing authentication and authorization using Spring Security and JWT.
- Securing user passwords with BCrypt.
- Connecting backend applications to a MySQL-compatible cloud database.
- Building responsive web interfaces using HTML, CSS, and JavaScript.
- Managing user-specific application data.
- Implementing validation and centralized exception handling.
- Monitoring backend health using Spring Boot Actuator.
- Managing source code with Git and GitHub.
- Deploying a full-stack application using Render and Vercel.

## Future Enhancements

Potential improvements for future versions include:

- Automated frontend and backend testing.
- Streaming AI responses for a more interactive experience.
- Support for additional AI models and providers.
- Advanced conversation search and organization.
- Enhanced monitoring and application analytics.

## Author

**Manish Maurya**

Aspiring Full-Stack Developer | Java & Spring Boot Enthusiast

Passionate about building modern web applications, developing scalable backend systems, and continuously learning new technologies.

- **GitHub:** [Manish9917](https://github.com/Manish9917)
- **Project:** [CodeAlpha AI Chatbot](https://github.com/Manish9917/CodeAlpha_AIChatbot)
- **Live Demo:** [Try the Application](https://codealphaaichatbot-frontend.vercel.app/)

---

## Acknowledgements

Developed as part of the **CodeAlpha Internship Program – Task 3**.

Special thanks to CodeAlpha for providing the opportunity to gain practical experience in full-stack application development.

---

\<p align="center">
&#x20; \<strong>If you find this project interesting, consider giving it a ⭐ on GitHub!\</strong>
\</p>
