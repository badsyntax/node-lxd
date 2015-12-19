#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:ubuntu-lxc/lxd-stable

sudo apt-get update
curl -sL https://deb.nodesource.com/setup_5.x | sudo bash -
sudo apt-get install -y lxd build-essential nodejs

sudo newgrp lxd
sudo lxd-images import ubuntu --alias ubuntu
