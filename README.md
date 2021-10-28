# Base repository for React + Django project

## Prerequisites
- docker
- python
- nodejs

## Configuring and Setup
1. In `.env.dev` set a project name
```
COMPOSE_PROJECT_NAME="sample-project"
```

2. Open `package.json` and set the following fields
```json
{
    "name": "<name>",
    "description": "<description>",
    "author": "<author>",
    "license": "<license>",
}
```

3. Run `npm install` in the `frontend` directory

4. Create a virtual environment with `python -m venv .venv` and activate it with `source .venv/bin/activate`

5. Install python packages by running `pip install -r requirements.txt` in the `backend` directory

## Running in development

1. Build images with

```bash
docker-compose -f docker-compose.yml -f development.yml --env-file .env.dev build
```

2. Bring up the application stack with

```bash
docker-compose -f docker-compose.yml -f development.yml --env-file .env.dev up
```

3. If setting up a dev environment for the first time, create a superuser

```bash
docker-compose -f docker-compose.yml -f development.yml --env-file .env.dev exec django python manage.py createsuperuser --username admin --email test@test.com
```

4. Make migrations 

```bash
docker-compose -f docker-compose.yml -f development.yml --env-file .env.dev exec django python manage.py migrate
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