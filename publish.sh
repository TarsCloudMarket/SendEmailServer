#!/bin/bash

TARS_K8S_WEB_HOST="http://tars-dev.prod.tarsyun.com"
TARS_K8S_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJhZG1pbiIsImlhdCI6MTYzMjQ2MTg3NywiZXhwIjoxNzE4MDg0Mjc3fQ.2WqnAoNWS0qYXbSn_OuL18a59R4nkxrjwIeDjGii3QU"
TARS_K8S_BASE_IMAGE="tarscloud/tars.nodejsbase"

APP=Cloud

TARGET=SendEmailServer

TARGET_PATH=tmp/${TARGET}

mkdir -p tmp

echo "mkdir -p ${TARGET_PATH}"
mkdir -p ${TARGET_PATH}

echo "npm run build"
npm run build

echo "rm old build & copy new build"
rm -rf ${TARGET_PATH}/build
cp -rf build ${TARGET_PATH}/
echo "copy package.json"
cp package.json ${TARGET_PATH}/

cd ${TARGET_PATH}
echo "npm install --production"
npm install --production

cd ..

echo "tar czf ${TARGET}.tgz"
tar czf ${TARGET}.tgz ${TARGET}

echo "curl ${TARGET}.tgz to k8s"

curl --progress-bar ${TARS_K8S_WEB_HOST}/pages/k8s/api/upload_and_publish?ticket=${TARS_K8S_TOKEN} -Fsuse=@${TARGET}.tgz -Fapplication=${APP} -Fmodule_name=${TARGET} -Fserver_type=nodejs  -Fbase_image=${TARS_K8S_BASE_IMAGE} -Fcomment=upload

echo ""

cd ..