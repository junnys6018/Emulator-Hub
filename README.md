# Emulator Hub

A fullstack web application for playing NES and CHIP 8 roms.

## Prerequisites
- docker
- nodejs 14

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

## Testing, Linting and Formatting

### Backend

| Action     | Command          |
|------------|------------------|
| Linting    | `npm run lint`   |
| Formatting | `npm run pretty` |

### Frontend

| Action     | Command          |
|------------|------------------|
| Testing    | `npm test`       |
| Linting    | `npm run lint`   |
| Formatting | `npm run pretty` |

## Building and Pushing to Docker Hub

1. Build images with `./build.sh`, two images will be created

```bash
$ docker image ls
REPOSITORY                         TAG       IMAGE ID       CREATED        SIZE
emulator-hub-production_nginx      latest    891695c5edf1   2 hours ago    135MB
emulator-hub-production_node       latest    056347224e92   4 days ago     363MB
```

2. Tag your images

```
$ docker tag emulator-hub-production_nginx junnys/emulator-hub_nginx:<version>

$ docker tag emulator-hub-production_node junnys/emulator-hub_node:<version>

$ docker image ls
REPOSITORY                       TAG           IMAGE ID       CREATED        SIZE
junnys/emulator-hub_nginx        <version>     891695c5edf1   2 hours ago    135MB
junnys/emulator-hub_node         <version>     056347224e92   4 days ago     363MB
emulator-hub-production_nginx    latest        891695c5edf1   2 hours ago    135MB
emulator-hub-production_node     latest        056347224e92   4 days ago     363MB
```

3. Push to Docker Hub

```
docker push junnys/emulator-hub_nginx:<version>
docker push junnys/emulator-hub_node:<version>
```

## Deployment

1. Run `cp .env.prod.template .env.prod`

2. Open `.env.prod` and set the following values. (You may optionally change `POSTGRES_DB` and `POSTGRES_USER`)
```env
APPLICATION_VERSION=<version> # Same as container tag
POSTGRES_PASSWORD=<password>
SSL_CERT_PATH=</path/to/ssl.cert>
SSL_KEY_PATH=</path/to/ssl.key>
```

3. Run `docker-compose -f docker-compose.yml -f production.yml --env-file .env.prod up -d`
