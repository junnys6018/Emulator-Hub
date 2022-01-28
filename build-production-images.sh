#!/bin/bash
pushd "$(dirname "$0")"

rm -rf nginx/static
mkdir -p nginx/static

# generate static files

# build with webpack
pushd frontend
npm install
npm run build
popd

cp -R build/production/* nginx/static/

# copy in tsconfig.json from the root directory into child directories, so that they are visible to the docker context
cp tsconfig.json backend/tsconfig-base.json

# create images
docker-compose -f docker-compose-build.yml -p emulator-hub-production build

rm backend/tsconfig-base.json

popd