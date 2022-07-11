#!/bin/bash
apt update -y
apt upgrade -y
apt autoremove -y
apt install npm git
pm2 --version || (npm install -g pm2 && pm2 startup)
git clone https://github.com/QuintenMuyllaert/DLC-Scoreboard/ 
cd DLC-Scoreboard/
git reset --hard
git pull -f
git checkout dev
pm2 delete all
cd Backend/
npm i && pm2 start --name="Backend" "npm run dev"
cd ../Frontend/
npm i && pm2 start --name="Frontend" "npm run dev"
pm2 save