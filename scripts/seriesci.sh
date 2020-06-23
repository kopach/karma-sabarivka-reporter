#!/usr/bin/env bash

duration_lint=$3
duration_build=$1
duration_test=$2

echo "TRAVIS_BRANCH= $TRAVIS_BRANCH"

echo "post code coverage to seriesci"
echo "$(npx lcov-total coverage/lcov.info)%" | xargs -I {} curl \
    --header "Authorization: Token ${SERIESCI_TOKEN}" \
    --data-urlencode value="{}" \
    --data sha="${TRAVIS_COMMIT}" \
    https://seriesci.com/api/repos/kopach/karma-sabarivka-reporter/coverage/combined

echo "post bundle size to seriesci"
du -sh dist/ | awk '{print $1}' | xargs -I {} curl \
    --header "Authorization: Token ${SERIESCI_TOKEN}" \
    --data-urlencode value="{}" \
    --data sha="${TRAVIS_COMMIT}" \
    https://seriesci.com/api/repos/kopach/karma-sabarivka-reporter/bundlesize/combined

echo "post lint & build & test execution time to seriesci"
curl \
    --header "Authorization: Token c698677f-ebb7-44f8-9d72-47a73b7e2121" \
    --header "Content-Type: application/json" \
    --data "{\"values\":[{\"line\":\"build\",\"value\":\"${duration_build}s\"},{\"line\":\"test\",\"value\":\"${duration_test}s\"},{\"line\":\"lint\",\"value\":\"${duration_lint}s\"}],\"sha\":\"$(git rev-parse HEAD)\"}" \
    https://seriesci.com/api/kopach/karma-sabarivka-reporter/time/many

echo "post number of dependencies to seriesci"
(npm ls --depth=0 --prod --parseable --silent || true) | grep -c node_modules | xargs -I {} curl \
    --header "Authorization: Token ${SERIESCI_TOKEN}" \
    --data-urlencode value="{}" \
    --data sha="${TRAVIS_COMMIT}" \
    https://seriesci.com/api/repos/kopach/karma-sabarivka-reporter/dependencies/combined

echo "post number of lines of code to seriesci"
npx cloc src --csv | grep 'SUM.*' -o | cut -d, -f 4 | xargs -I {} curl \
    --header "Authorization: Token ${SERIESCI_TOKEN}" \
    --data-urlencode value="{}" \
    --data sha="${TRAVIS_COMMIT}" \
    https://seriesci.com/api/repos/kopach/karma-sabarivka-reporter/lines-of-code/combined
