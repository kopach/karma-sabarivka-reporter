#!/usr/bin/env bash

SERIESCI_TOKEN=$1

# More info on this: https://github.community/t/github-sha-not-the-same-as-the-triggering-commit/18286
if [ "$GITHUB_EVENT_NAME" == "pull_request" ]; then
    GIT_SHA=$(cat $GITHUB_EVENT_PATH | jq -r .pull_request.head.sha)
else
    GIT_SHA=$GITHUB_SHA
fi

echo "GIT_SHA: ${GIT_SHA}"

[[ -z "$GIT_SHA" ]] && {
    echo "Error: git SHA is empty"; exit 1;
}

[[ -z "$SERIESCI_TOKEN" ]] && {
    echo "Error: SERIESCI_TOKEN is empty"; exit 1;
}

echo "post code coverage to seriesci"
echo "$(npx lcov-total coverage/lcov.info)%" | xargs -I {} curl \
    --header "Authorization: Token ${SERIESCI_TOKEN}" \
    --data-urlencode value="{}" \
    --data sha="${GIT_SHA}" \
    https://seriesci.com/api/repos/kopach/karma-sabarivka-reporter/coverage/combined

echo "\n\n"

echo "post bundle size to seriesci"
du -sh dist/ | awk '{print $1}' | xargs -I {} curl \
    --header "Authorization: Token ${SERIESCI_TOKEN}" \
    --data-urlencode value="{}" \
    --data sha="${GIT_SHA}" \
    https://seriesci.com/api/repos/kopach/karma-sabarivka-reporter/bundlesize/combined

echo "\n\n"

echo "post lint & build & test execution time to seriesci"
duration_build=$(cat build-execution-time.log)
duration_test=$(cat test-execution-time.log)
duration_lint=$(cat lint-execution-time.log)
curl \
    --header "Authorization: Token ${SERIESCI_TOKEN}" \
    --header "Content-Type: application/json" \
    --data "{\"values\":[{\"line\":\"build\",\"value\":\"${duration_build}\"},{\"line\":\"test\",\"value\":\"${duration_test}\"},{\"line\":\"lint\",\"value\":\"${duration_lint}\"}],\"sha\":\"${GIT_SHA}\"}" \
    https://seriesci.com/api/kopach/karma-sabarivka-reporter/time/many

echo "\n\n"

echo "post number of dependencies to seriesci"
(npm ls --depth=0 --prod --parseable --silent || true) | grep -c node_modules | xargs -I {} curl \
    --header "Authorization: Token ${SERIESCI_TOKEN}" \
    --data-urlencode value="{}" \
    --data sha="${GIT_SHA}" \
    https://seriesci.com/api/repos/kopach/karma-sabarivka-reporter/dependencies/combined

echo "\n\n"

echo "post number of lines of code to seriesci"
npx cloc src --csv | grep 'SUM.*' -o | cut -d, -f 4 | xargs -I {} curl \
    --header "Authorization: Token ${SERIESCI_TOKEN}" \
    --data-urlencode value="{}" \
    --data sha="${GIT_SHA}" \
    https://seriesci.com/api/repos/kopach/karma-sabarivka-reporter/lines-of-code/combined
