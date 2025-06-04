FROM amazoncorretto:17 AS backend
ENV APP_ENCRYPTION_PASSWORD=""
WORKDIR app
COPY certs certs
EXPOSE 9100
ENTRYPOINT ["java", "-jar", "mon-aws-0.0.1-SNAPSHOT.jar"]


