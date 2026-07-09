# SkillPath Backend - Spring Boot Application

This document provides instructions for setting up and running the Spring Boot backend for the SkillPath application.

## Prerequisites

Before running the backend, ensure you have the following installed:

### 1. Java JDK 17 or higher
```bash
# Check Java version
java -version

# If not installed, download from:
# https://www.oracle.com/java/technologies/downloads/#java17
# OR
# https://adoptium.net/
```

### 2. Maven 3.8 or higher
```bash
# Check Maven version
mvn -version

# If not installed, download from:
# https://maven.apache.org/download.cgi
```

### 3. MySQL 8.0 or higher
```bash
# Check MySQL version
mysql --version

# If not installed, download from:
# https://dev.mysql.com/downloads/mysql/
```

## Database Setup

The MySQL database will be automatically created when you run the application. 
However, you can create it manually:

```sql
CREATE DATABASE IF NOT EXISTS skillpath;
```

The application is configured to connect with:
- Host: localhost
- Port: 3306
- Username: root
- Password: root
- Database: skillpath

## Configuration

The database configuration is in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/skillpath
spring.datasource.username=root
spring.datasource.password=root
server.port=8080
```

If your MySQL credentials are different, update this file accordingly.

## Running the Backend

### Option 1: Using Maven (Recommended)

```bash
cd backend
mvn spring-boot:run
```

### Option 2: Using Spring Boot JAR

```bash
cd backend

# Build the application
mvn clean package -DskipTests

# Run the JAR file
java -jar target/skillpath-backend-1.0.0.jar
```

### Option 3: Using IDE (IntelliJ IDEA, Eclipse, VS Code)

1. Open the `backend` folder as a Maven project
2. Wait for dependencies to download
3. Run `SkillPathApplication.java` as a Spring Boot application

## Verify Backend is Running

The backend will start on `http://localhost:8080`. You can verify it's working:

```bash
# Test the daily-task endpoint
curl http://localhost:8080/api/daily-task

# Expected response:
# {"id":1,"title":"...","description":"...","language":"Python","difficulty":"easy","xp":10}
```

## API Endpoints

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Register a new user |
| POST | `/api/users/login` | Login user |
| GET | `/api/users/{id}` | Get user by ID |

### Question Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/daily-task` | Get random question |
| GET | `/api/daily-task?language=Python` | Get random question for specific language |
| GET | `/api/questions` | Get all questions |
| GET | `/api/questions/{language}` | Get questions by language |

### Progress Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/{userId}/progress` | Get user progress |
| POST | `/api/users/{userId}/progress` | Update user progress |
| POST | `/api/users/{userId}/complete-task` | Mark task as complete |

## Frontend Integration

The frontend is already configured to work with this backend. The frontend runs on `http://localhost:5173`.

### Example Fetch Code

```javascript
// Register a new user
const registerUser = async () => {
  const response = await fetch('http://localhost:8080/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    })
  });
  return response.json();
};

// Login
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:8080/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Get daily task
const getDailyTask = async () => {
  const response = await fetch('http://localhost:8080/api/daily-task?language=Python');
  return response.json();
};

// Complete a task
const completeTask = async (userId, xp) => {
  const response = await fetch(`http://localhost:8080/api/users/${userId}/complete-task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ xp: 10 })
  });
  return response.json();
};
```

## Troubleshooting

### Port 3306 already in use
If MySQL port is different, update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/skillpath
```

### Connection refused to localhost:8080
Make sure no other application is using port 8080. You can change the port in `application.properties`:
```properties
server.port=8081
```

### Maven build fails
Try cleaning the Maven cache:
```bash
mvn clean
mvn dependency:resolve
```

### Database connection errors
1. Verify MySQL is running
2. Check credentials in `application.properties`
3. Ensure the database exists

## Development

### Hot Reload
The backend supports hot reload when running with Maven:
```bash
mvn spring-boot:run
```

### Build for Production
```bash
mvn clean package -DskipTests
```

The JAR file will be created in `backend/target/` directory.

## Project Structure

```
backend/
├── src/main/java/com/skillpath/
│   ├── SkillPathApplication.java    # Main application
│   ├── config/                      # Configuration classes
│   │   ├── CorsConfig.java
│   │   └── SecurityConfig.java
│   ├── controller/                  # REST controllers
│   │   ├── UserController.java
│   │   ├── QuestionController.java
│   │   └── ProgressController.java
│   ├── service/                     # Business logic
│   │   ├── UserService.java
│   │   ├── QuestionService.java
│   │   └── ProgressService.java
│   ├── repository/                  # Data access
│   │   ├── UserRepository.java
│   │   ├── QuestionRepository.java
│   │   └── ProgressRepository.java
│   ├── entity/                      # JPA entities
│   │   ├── User.java
│   │   ├── Question.java
│   │   └── Progress.java
│   └── dto/                         # Data transfer objects
│       ├── UserRequest.java
│       ├── UserResponse.java
│       ├── QuestionDTO.java
│       └── ProgressDTO.java
├── src/main/resources/
│   └── application.properties       # Application config
└── pom.xml                          # Maven dependencies
```

