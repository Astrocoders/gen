#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

const { argv } = process

// No arguments
if (!argv[3]) {
  const creator = require(`${process.cwd()}/.templates/${argv[2]}.js`)
  console.log(
    '🤷',
    chalk.red("No arguments provided. Here's how to use this creator: \n"),
  )

  Object.keys(creator.args).forEach(arg => {
    console.log(chalk.bold.white(`--${arg}=value`), `${creator.args[arg]}`)
  })
} else {
  const creator = require(`${process.cwd()}./templates/${argv[2]}.js`)

  const [, , , ...args] = argv

  const finalArgs = args.reduce((acc, arg) => {
    const combo = arg.split('=')
    return { [combo[0].replace('--', '')]: combo[1], ...acc }
  }, {})

  const destination = path.join(__dirname, '../', creator.where(finalArgs))

  const content = creator.gen(finalArgs)

  fs.writeFileSync(destination, content)

  creator.postBuild()
}
