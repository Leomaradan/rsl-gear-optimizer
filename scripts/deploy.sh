#!/bin/sh
echo "${SFTP_KEY}" | base64 --decode >/tmp/sftp_rsa
scp -i /tmp/sftp_rsa -r ../build ${SFTP_USER}@${SFTP_SERVER}:${SFTP_DIRECTORY}