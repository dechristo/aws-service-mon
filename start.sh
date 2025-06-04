#! /bin/bash

echo "[INFO]: Building Backend App..."
./gradlew build
echo "[INFO]: Backend SUCCESSFULLY built."

echo "[INFO]: Building Frontend App..."
cd src/fe-app
npm install
npx ng build
echo "[INFO]: Frontend App SUCCESSFULLY built."

echo "[INFO]: Building Http Monitoring App..."
cd ../http-mon
npm install
echo "[INFO]: Http Monitoring App SUCCESSFULLY built."

echo "[INFO]: Starting the Monitoring App..."
cd ../..
trap 'kill %1; kill %2' SIGINT
java -jar build/libs/mon-aws-0.0.1-SNAPSHOT.jar &
    (cd src/fe-app && npx ng serve --host=0.0.0.0)