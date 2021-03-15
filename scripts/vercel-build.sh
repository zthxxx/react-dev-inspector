#!/usr/bin/env bash
# working directory is project root dir

# https://www.explainshell.com/explain/1posix/set
set -ex

# https://github.com/chalk/supports-color/blob/main/index.js#L21
export FORCE_COLOR=true

env

npm run build

# due to vercel bug of symlink file
rm -rf sites/cra/src/layouts
cp -rf sites/umi3/src/layouts sites/cra/src/

rm -rf sites/vite2/src/layouts
cp -rf sites/umi3/src/layouts sites/vite2/src/


npm run build:site
