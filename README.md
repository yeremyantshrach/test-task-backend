# How to start application

```bash
$ cp ./.env.sample ./.env
$ npm install
```

## Running the app

```bash

# run all necessary services for application
# this will run application under watch mode

$ docker-compose up --build -d

# if you want to run app on watch mode without docker

$ docker stop test-task-be-api-1
$ npm run start:dev

# to stop services

$ docker-compose down

```
