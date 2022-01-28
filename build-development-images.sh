#!/bin/bash
pushd "$(dirname "$0")"

# copy in tsconfig.json from the root directory into child directories, so that they are visible to the docker context
cp tsconfig.json frontend/tsconfig-base.json
cp tsconfig.json backend/tsconfig-base.json

docker-compose -f docker-compose.yml -f development.yml --env-file .env.dev build

rm frontend/tsconfig-base.json backend/tsconfig-base.json

popd