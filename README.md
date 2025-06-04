# AWS EC2 Instances monitor

A cheap and fast alternative for Grafana, New Relic and Cloud Watch.
Monitor you microservices on AWS through actuator endpoints.
This is app is designed only for instances deployed on EC2 with load balancer sticky sessions.

The app can monitor:
 - DB Connection pool (total, jpa and redshift)
 - Thread executors.
 - JVM Memory usage
 - Instances Health.

The following instructions assumes you are running the app locally. If this is not the case,
please replace `localhost` by the proper host / ip address.

The 'start.sh' scrypt handles all needed build / starts for the app. Please see the **Troubleshooting** section
for solving the problem during startup.

## 1. Starting the Backend
In order to run locally, you must either set `APP_ENCRYPTION_PASSWORD` environment variable or replace the values of
the mentioned attributes by plain text.

After successfully compiling the app (e.g.: `/gradlew build`), you
can start it by running `jar -jar build/libs/mon-aws-0.0.1-SNAPSHOT.jar`.

## 2. Starting the Frontend

Inside the frontend app folder `fe-app`, follow the steps:
1. `npm install`
2. `npx ng serve --host=0.0.0.0 --port=4200`

*The default port is already `4200` so you can omit it if not changing the port.

***If running locally, you must change the ip address on ServerConfig class (`config/ServerConfig.ts`)
to you machine's ip address.**

## 3. Endpoints
The endpoints are available under the app's OpenAPi url:

http://localhost:9100/swagger-ui/index.html

## 4. Docker
As an alternative you can run the app in Docker.
For running it with `docker-compose` simply run `docker-compose up`.

## 5. TODO

 - Refactor frontend repeated code: create a service for http requests and use D.I.
 - Refactor backend services: add interface / abstract class and avoid repeated methods / override for specifics.
 - Write unit test for the backend.
 - Write integration tests or the backend.