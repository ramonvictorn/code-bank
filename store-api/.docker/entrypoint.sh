#!/bin/bash

npm install

dockerize -wait tcp://store-db:5432 -timeout 40s

npm run start:dev