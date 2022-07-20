#!/bin/bash

# clear changes to core
sudo git reset --hard

# pull latest version of the repository
sudo git pull -f

# manage pm2
sudo pm2 stop all

sudo pm2 delete all

cd ./Frontend && sudo npm build 
sudo pm2 start --name="Frontend" "sudo npm run dev"
cd ..
cd ./Backend && npx tsc && sudo pm2 start --name="Backend" "sudo node ./dist/index.js"
cd ..

sudo pm2 save

sudo pm2 monit