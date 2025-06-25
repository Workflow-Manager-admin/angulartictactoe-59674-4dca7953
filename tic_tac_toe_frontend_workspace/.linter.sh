#!/bin/bash
cd /home/kavia/workspace/code-generation/angulartictactoe-59674-4dca7953/tic_tac_toe_frontend_workspace/tic_tac_toe_frontend
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

