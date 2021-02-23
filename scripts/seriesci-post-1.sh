#!/usr/bin/env bash

SERIESCI_TOKEN=$1
[[ -z "$SERIESCI_TOKEN" ]] && {
    echo "Error: SERIESCI_TOKEN is empty"
    exit 1
}

GIT_SHA=$2
[[ -z "$GIT_SHA" ]] && {
    echo "Error: git SHA is empty"
    exit 1
}

SERIE_NAME=$3
[[ -z "$SERIE_NAME" ]] && {
    echo "Error: SERIE_NAME is empty"
    exit 1
}

SERIE_VALUE=$4
[[ -z "$SERIE_VALUE" ]] && {
    echo "Error: SERIE_VALUE is empty"
    exit 1
}

curl \
  --header "Authorization: Token ${SERIESCI_TOKEN}" \
  --header "Content-Type: application/json" \
  --data "{
    \"value\":\"${SERIE_VALUE}\",
    \"sha\":\"${GIT_SHA}\"
  }" \
  https://seriesci.com/api/kopach/karma-sabarivka-reporter/${SERIE_NAME}/one

echo ""
