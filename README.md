# Emulator Hub

A fullstack web application for playing NES and CHIP 8 roms.

## Prerequisites
- docker
- python
- nodejs

## Running in development

To simplify commands, I recommend making the following alias

```bash
alias docker-dev="docker-compose -f docker-compose.yml -f development.yml --env-file .env.dev"
```

1. Build images with

```bash
docker-dev build
```

2. Bring up the application stack with

```bash
docker-dev up
```

3. Make migrations with

```bash
docker-dev exec django python manage.py migrate
```

4. If setting up a dev environment for the first time, create a superuser

```bash
docker-dev exec django python manage.py createsuperuser --username admin --email test@test.com
```

## Testing, Linting and Formatting

### Backend

| Action     | Command                                                    |
|------------|------------------------------------------------------------|
| Testing    | `ENVIRONMENT=test SECRET_KEY=secret python manage.py test` |
| Linting    | `python -m pycodestyle .`                                  |
| Formatting | `python -m autopep8 --in-place --recursive .`              |

### Frontend

| Action     | Command          |
|------------|------------------|
| Testing    | `npm test`       |
| Linting    | `npm run lint`   |
| Formatting | `npm run pretty` |

## Deployment

1. Run `cp .env.prod.template .env.prod`

2. Open `.env.prod` and set the following values. (You may optionally change `POSTGRES_DB` and `POSTGRES_USER`)
```
COMPOSE_PROJECT_NAME=<name>
SECRET_KEY=<key>
POSTGRES_PASSWORD=<password>
SSL_CERT_PATH=</path/to/ssl.cert>
SSL_KEY_PATH=</path/to/ssl.key>
```

3. Run `./build.sh` to build the deployment ready images. The following images are produced:

| Image  | Description                                                                               |
|--------|-------------------------------------------------------------------------------------------|
| django | Backend Server                                                                            |
| nginx  | Front facing server. Serves static files and acts as a reverse proxy to the django server |

4. Pull images and deploy to your container service of choice
