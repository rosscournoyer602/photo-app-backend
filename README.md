# Express server using TypeORM, and Passport.js JWT authentication

### Getting started

1.  In the root project directory, from the command line, create default environment variables

        cp default.env .env

2.  In the .env file, change the secret for JWT authorization if needed

        APP_PORT=8080
        APP_SECRET=supersecret

        POSTGRESDB_HOST=localhost
        POSTGRESDB_USER=tsboilerplate
        POSTGRESDB_ROOT_PASSWORD=tsboilerplate
        POSTGRESDB_DATABASE=tsboilerplate
        POSTGRESDB_LOCAL_PORT=5432
        POSTGRESDB_DOCKER_PORT=5432

        NODE_LOCAL_PORT=8080
        NODE_DOCKER_PORT=8080

3.  Run with docker

        docker-compose up

4.  Use Postman to import the `TSED.postman_collection.json` file at the root directory for some sample requests
