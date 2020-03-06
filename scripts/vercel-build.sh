#!/usr/bin/env bash
# working directory is project root dir

# https://www.explainshell.com/explain/1posix/set
set -ex

env

npm run build

# due to vercel bug of symlink file
rm -rf sites/cra/src/layouts
cp -rf sites/umi3/src/layouts sites/cra/src/

npm run build:site
