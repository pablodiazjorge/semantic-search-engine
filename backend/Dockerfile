# Backend Dockerfile - compatible con Java 21 y Maven 3.9.6
# Etapa 1: build con Maven + JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Etapa 2: runtime con JRE 21 Alpine
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/semantic-search-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
