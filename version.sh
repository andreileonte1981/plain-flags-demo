if [ -z "$1" ]; then
    ARG=patch
else
    ARG=$1  # minor, major
fi

cd service
npm version $ARG

cd ../webapp
npm version $ARG
