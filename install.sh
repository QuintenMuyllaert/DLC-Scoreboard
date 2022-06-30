#!/bin/bash
apt update
apt upgrade
apt install npm git
npm i -g pm2 
pm2 startup
bash start.sh
