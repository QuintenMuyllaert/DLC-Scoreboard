#!/bin/bash

# clear changes to core
git reset --hard

# pull latest version of the repository
git pull -f

# manage pm2
pm2 stop all

pm2 delete all

cd ./Backend && npm i && pm2 start --name="Backend" "npm run dev"

cd ../Frontend && npm i && pm2 start --name="Frontend" "npm run dev"

pm2 save