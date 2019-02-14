#!/usr/bin/env bash
echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin openshift-registry.adorsys.de
npm install
npm run build
docker build -t "openshift-registry.adorsys.de/p2p-lending/app:latest" .
docker push openshift-registry.adorsys.de/p2p-lending/app:latest