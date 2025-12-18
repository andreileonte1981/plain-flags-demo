DOCKER_REPO_AND_USER=ghcr.io/andreileonte1981

BACKEND_IMAGE=plain-flags-demo-service
FRONTEND_IMAGE=plain-flags-demo-webapp

CURRENT_DIR=$(pwd)

cd service

BACKEND_VERSION=$(npm pkg get version -workspaces=false |tr -d \")

docker buildx use mybuilder

docker buildx build --platform linux/amd64,linux/arm64 \
-t $DOCKER_REPO_AND_USER/$BACKEND_IMAGE:$BACKEND_VERSION \
-t $DOCKER_REPO_AND_USER/$BACKEND_IMAGE:latest \
--push .

cd $CURRENT_DIR

cd webapp

FRONTEND_VERSION=$(npm pkg get version -workspaces=false |tr -d \")

docker buildx build --platform linux/amd64,linux/arm64 \
-t $DOCKER_REPO_AND_USER/$FRONTEND_IMAGE:$FRONTEND_VERSION \
-t $DOCKER_REPO_AND_USER/$FRONTEND_IMAGE:latest \
--push .
