# 🎬 OMDB Movie Explorer

OMDB Movie Explorer is a full-stack Spring Boot application that allows users to search for movies and view detailed information using the OMDb (Open Movie Database) API. The project demonstrates backend API integration, custom caching, and dynamic frontend rendering using vanilla JavaScript.

---

## 🚀 Features

- 🔍 Search movies by title
- 🎞️ View detailed movie information (poster, plot, genre, rating, release year)
- ⚡ Custom in-memory caching to reduce repeated API calls
- 🌐 RESTful API built with Spring Boot
- 📄 Static frontend served directly from backend
- ❌ Handles movie-not-found and API errors gracefully

---

## 🛠️ Tech Stack

### Backend
- Java
- Spring Boot
- REST APIs
- Maven

### Frontend
- HTML
- CSS
- JavaScript (Vanilla JS)

### External API
- OMDb API (Open Movie Database)

---

## 📂 Project Architecture

```text
Controller Layer
   ↓
Service Layer
   ↓
OMDb External API
   ↓
In-Memory Cache
   ↓
Frontend (HTML + JS)
📁 Project Structure
text
Copy code
src/main/java/com/jit/omdb/
├── controller/      # REST API endpoints
├── service/         # Business logic & OMDb API calls
├── cache/           # Custom in-memory cache
└── OmdbExplorerApplication.java

src/main/resources/
├── static/          # Frontend files
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
└── application.properties

⚙️ Setup & Run Instructions
Prerequisites
Java 17+

Maven

OMDb API Key

Steps
Clone the repository
git clone https://github.com/<your-username>/OMDB-Movie-Explorer.git](https://github.com/Prasanjit2003/OMDB-Movie-Explorer.git
Open the project
cd OMDB-Movie-Explorer
Configure API key in application.properties

properties
Copy code
omdb.api.key=YOUR_API_KEY
Run the application
mvn spring-boot:run
Open browser
http://localhost:8080

🧠 Caching Strategy
Uses a custom InMemoryCache class

Stores movie responses by title

Prevents unnecessary repeated API calls

Improves response time and performance

❗ Error Handling
Invalid movie search handling

Empty response validation

API failure fallback messages

📌 Future Improvements
Pagination support

Search history

Favorites feature

Database integration (MySQL)

React-based frontend

Redis caching

👨‍💻 Author
Prasanjit Behera
Full Stack Developer (Java & Spring Boot)
Skills: Java | Spring Boot | REST APIs | MySQL | JavaScript

📄 License
This project is open-source and free to use.
