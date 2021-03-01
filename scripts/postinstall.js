const fs = require('fs')
const { execSync } = require('child_process')

if (fs.existsSync('./package-lock.json')) {
  execSync('npm run bootstrap', { stdio: 'inherit' })
}
