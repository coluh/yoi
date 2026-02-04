#!/usr/bin/env bash

set -e
set -x

cd ./fe
npm install
npm run build
cd ..

cd ./server
go build -o main ./cmd/server
cd ..

rm -rf ./build
mkdir ./build
mv ./fe/dist ./build/
mv ./server/main ./build/

sed "s/=.*/=/" ./server/.env.local > ./build/.env

echo "Build completed."
tree ./build
