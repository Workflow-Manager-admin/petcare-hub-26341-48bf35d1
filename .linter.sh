#!/bin/bash
cd /home/kavia/workspace/code-generation/petcare-hub-26341-48bf35d1/petcare_hub
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

