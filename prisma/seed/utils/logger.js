
// prisma/seed/utils/logger.js
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

const logger = {
  title: (msg) => {
    console.log(`\n${colors.bright}${colors.magenta}${'='.repeat(50)}${colors.reset}`)
    console.log(`${colors.bright}${colors.magenta}  ${msg}${colors.reset}`)
    console.log(`${colors.bright}${colors.magenta}${'='.repeat(50)}${colors.reset}\n`)
  },
  
  section: (msg) => {
    console.log(`\n${colors.bright}${colors.cyan}► ${msg}${colors.reset}`)
  },
  
  info: (msg, ...args) => {
    console.log(`  ${colors.blue}ℹ${colors.reset} ${msg}`, ...args)
  },
  
  success: (msg, ...args) => {
    console.log(`  ${colors.green}✓${colors.reset} ${msg}`, ...args)
  },
  
  warn: (msg, ...args) => {
    console.log(`  ${colors.yellow}⚠${colors.reset} ${msg}`, ...args)
  },
  
  error: (msg, ...args) => {
    console.log(`  ${colors.red}✗${colors.reset} ${msg}`, ...args)
  },
}

module.exports = { logger }