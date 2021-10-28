#!/bin/bash
pushd "$(dirname "$0")"

rm -rf nginx/serve
mkdir -p nginx/serve/dist

# generate static files

# create a virtual environment
if [ ! -d ".venv" ] 
then
    python3 -m venv .venv
fi
source .venv/bin/activate

pushd backend

# install the version of Django specified in requirements.txt
pip install $(cat requirements.txt | grep Django)

# set these environment variables so we can run collectstatic
export SECRET_KEY="secret"
export ENVIRONMENT="build"
python3 manage.py collectstatic
popd

# deactivate virtual environment
deactivate

# build with webpack
pushd frontend
npm install
npm run build
popd

cp -R build/dist nginx/serve

# create images
docker-compose -f docker-compose.yml -f production.yml --env-file .env.prod build

popd