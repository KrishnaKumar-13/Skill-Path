# Stage 1: Build the application using Maven
FROM maven:3.9.7-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml file first
COPY pom.xml .

# Download dependencies (this caches them in a separate Docker layer)
# Using 'go-offline' speeds up subsequent builds if only source code changes
RUN mvn dependency:go-offline -B

# Copy the actual source code
COPY src ./src

# Build the application, skipping tests for faster deployment builds
RUN mvn clean package -DskipTests

# Stage 2: Create a minimal image for running the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR file from the 'build' stage
# The wildcard handles the version number automatically (e.g., skillpath-backend-1.0.0.jar)
COPY --from=build /app/target/*.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Run the application
# We use a shell command to allow Render's $PORT environment variable to override
# the default 8080 port if Render provides it at runtime, ensuring compatibility
# without changing application.properties.
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:8080}"]
