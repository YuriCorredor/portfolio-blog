# RUN LOCALLY

- Initiate PostgreSQL:

```bash
docker run --name blog -p 5432:5432 -e POSTGRES_USER=blog -e POSTGRES_PASSWORD=changeme -e POSTGRES_DB=blog -d postgres
```

--name is the name of the container, -p is the port mapping, -e are the environment variables, -d is the daemon mode. POSTGRES_PASSWORD is the password for the user, POSTGRES_USER is the user name, POSTGRES_DB is the database name. The last argument is the image name.

- Verify if the database is running: the status should be "up *some-seconds* ago".

```bash
docker ps
```

This is the connection URL: "postgresql://blog:changeme@localhost:5432/blog".

This is where the postgres database is running.
