# Journal App 📝

A RESTful journaling application built with **Spring Boot** and **MongoDB**, featuring secure authentication, Google OAuth2 login, email notifications, and sentiment analysis.

## 🚀 Features

- **RESTful APIs:** Create, read, update, and delete journal entries.
- **Authentication & Security:** Spring Security, JWT authentication, and role-based authorization.
- **Google Login:** OAuth2 authentication integration.
- **Database:** MongoDB for storing users and journal entries.
- **Dynamic Queries:** MongoTemplate and Criteria API.
- **Email Notifications:** Gmail SMTP integration.
- **Sentiment Analysis:** External API integration to analyze journal content.

## 🛠️ Tech Stack

- **Language:** Java
- **Framework:** Spring Boot
- **Security:** Spring Security, JWT, OAuth2
- **Database:** MongoDB
- **Tools:** Maven, Git, GitHub, Postman

## ⚙️ Getting Started

### Prerequisites

- Java JDK 17 or compatible version required by the project
- MongoDB instance
- Maven
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   ```

2. Navigate to the project directory:

   ```bash
   cd YOUR_REPOSITORY
   ```

3. Configure your MongoDB connection, JWT secret, Google OAuth2 credentials, Gmail SMTP settings, and external API credentials in your application configuration.

4. Run the application:

   ```bash
   mvn spring-boot:run
   ```

5. Test the available REST APIs using Postman.

## 🔐 Configuration & Security

Keep sensitive credentials outside version control. Use environment variables or an untracked configuration file, and never commit passwords, API keys, OAuth2 secrets, or JWT signing secrets to GitHub.

## 🗺️ Upcoming Enhancements

- Redis caching
- Kafka-based event handling
- VPS deployment with Nginx and SSL

## 👨‍💻 Author

**Aman Ahmed**

- GitHub: [Amanahmed786](https://github.com/Amanahmed786)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/aman-ahmed-/)

---

*Built to strengthen backend development skills using Java and Spring Boot.*
