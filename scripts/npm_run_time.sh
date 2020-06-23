#!/usr/bin/env bash

script_name=$1

startTime=$(date +%s)

cmd="npm run ${script_name}"
$cmd
cmdExitCode=$(echo $? |  bc -l)

echo "${script_name} exit code: ${cmdExitCode}"

if [ $cmdExitCode -ne 0 ]; then
    exit $?
else
    duration=$(echo "$(date +%s) - $startTime" | bc)
    echo "${script_name} time: ${duration}s"
    echo "${duration}s" > ${script_name}-execution-time.log
fi
