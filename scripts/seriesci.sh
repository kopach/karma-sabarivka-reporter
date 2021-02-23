#!/usr/bin/env bash

SERIESCI_TOKEN=$1
[[ -z "$SERIESCI_TOKEN" ]] && {
    echo "Error: SERIESCI_TOKEN is empty"
    exit 1
}

# More info on this: https://github.community/t/github-sha-not-the-same-as-the-triggering-commit/18286
if [ "$GITHUB_EVENT_NAME" == "pull_request" ]; then
    GIT_SHA="$(cat $GITHUB_EVENT_PATH | jq -r .pull_request.head.sha)"
else
    GIT_SHA=$GITHUB_SHA
fi
[[ -z "$GIT_SHA" ]] && {
    echo "Error: git SHA is empty"
    exit 1
}
echo "GIT_SHA: ${GIT_SHA}"

echo "post code coverage to seriesci"
COVERAGE="$(npx lcov-total coverage/lcov.info)%"
echo "${COVERAGE}"
./scripts/seriesci-post-1.sh "${SERIESCI_TOKEN}" "${GIT_SHA}" "coverage" "${COVERAGE}"

echo "post bundle size to seriesci"
BUNDLE_SIZE="$(du -sh dist/ | awk '{print $1}')"
echo "${BUNDLE_SIZE}"
./scripts/seriesci-post-1.sh "${SERIESCI_TOKEN}" "${GIT_SHA}" "bundlesize" "${BUNDLE_SIZE}"

echo "post lint & build & test execution time to seriesci"
duration_build=$(cat build-execution-time.log)
echo "build duration: ${duration_build}"
duration_test=$(cat test-execution-time.log)
echo "test duration: ${duration_test}"
duration_lint=$(cat lint-execution-time.log)
echo "lint duration: ${duration_lint}"
curl \
    --header "Authorization: Token ${SERIESCI_TOKEN}" \
    --header "Content-Type: application/json" \
    --data "{\"values\":[{\"line\":\"build\",\"value\":\"${duration_build}\"},{\"line\":\"test\",\"value\":\"${duration_test}\"},{\"line\":\"lint\",\"value\":\"${duration_lint}\"}],\"sha\":\"${GIT_SHA}\"}" \
    https://seriesci.com/api/kopach/karma-sabarivka-reporter/time/many

echo ""

echo "post number of dependencies to seriesci"
NUMBER_OF_DEPENDENCIES="$( (npm ls --depth=0 --prod --parseable --silent || true) | grep -c node_modules )"
echo "${NUMBER_OF_DEPENDENCIES}"
./scripts/seriesci-post-1.sh "${SERIESCI_TOKEN}" "${GIT_SHA}" "dependencies" "${NUMBER_OF_DEPENDENCIES}"

echo "post number of lines of code to seriesci"
NUMBER_OF_LINES="$(npx cloc src --csv | grep 'SUM.*' -o | cut -d, -f 4)"
echo "${NUMBER_OF_LINES}"
./scripts/seriesci-post-1.sh "${SERIESCI_TOKEN}" "${GIT_SHA}" "lines-of-code" $NUMBER_OF_LINES
