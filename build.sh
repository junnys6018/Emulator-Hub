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

# create images
docker-compose -f docker-compose-build.yml -p emulator-hub-production build

popd