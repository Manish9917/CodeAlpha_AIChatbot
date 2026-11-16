# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src

RUN mvn -f backend/pom.xml clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar app.jar"]
