#!/usr/bin/env bash
set -euo pipefail

DOCKER_REPO_AND_USER=ghcr.io/andreileonte1981

BACKEND_IMAGE=plain-flags-demo-service-gcp
FRONTEND_IMAGE=plain-flags-demo-webapp-gcp

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT/service"
BACKEND_VERSION=$(npm pkg get version -workspaces=false | tr -d '"')

docker build \
  -t "$DOCKER_REPO_AND_USER/$BACKEND_IMAGE:$BACKEND_VERSION" \
  -t "$DOCKER_REPO_AND_USER/$BACKEND_IMAGE:latest" \
  .

docker push "$DOCKER_REPO_AND_USER/$BACKEND_IMAGE:$BACKEND_VERSION"
docker push "$DOCKER_REPO_AND_USER/$BACKEND_IMAGE:latest"

cd "$REPO_ROOT/gcp/webapp"
FRONTEND_VERSION=$(npm pkg get version -workspaces=false | tr -d '"')

docker build \
  -t "$DOCKER_REPO_AND_USER/$FRONTEND_IMAGE:$FRONTEND_VERSION" \
  -t "$DOCKER_REPO_AND_USER/$FRONTEND_IMAGE:latest" \
  .

docker push "$DOCKER_REPO_AND_USER/$FRONTEND_IMAGE:$FRONTEND_VERSION"
docker push "$DOCKER_REPO_AND_USER/$FRONTEND_IMAGE:latest"

printf "\nUploaded images:\n"
printf "  %s/%s:%s\n" "$DOCKER_REPO_AND_USER" "$BACKEND_IMAGE" "$BACKEND_VERSION"
printf "  %s/%s:latest\n" "$DOCKER_REPO_AND_USER" "$BACKEND_IMAGE"
printf "  %s/%s:%s\n" "$DOCKER_REPO_AND_USER" "$FRONTEND_IMAGE" "$FRONTEND_VERSION"
printf "  %s/%s:latest\n" "$DOCKER_REPO_AND_USER" "$FRONTEND_IMAGE"
