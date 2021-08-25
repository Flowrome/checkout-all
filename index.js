#!/usr/bin/env node

const Git = require("nodegit")
const shell = require("shelljs")
const ora = require("ora")

const checkoutSync = (arr) => {
  if (arr.length > 0) {
    const currentBranch = arr[0]
    const spinner = ora(`Switching to branch ${currentBranch}`).start()
    shell.exec(`git checkout ${currentBranch}`, () => {
      spinner.stop()
      arr.shift()
      checkoutSync(arr)
    })
  } else {
    console.log("YAY WE DONE")
  }
}

const init = async () => {
  try {
    const repository = await Git.Repository.open(process.cwd())
    const references = await repository.getReferences()
    let options = []
    references
      .filter((ref) => ref.isRemote() === 1)
      .forEach((ref) => {
        const name = ref
          .name()
          .split("/")
          .slice(ref.name().split("/").indexOf("origin") + 1)
          .join("/")
        options = [...options, name]
      })
    checkoutSync(options)
  } catch (err) {
    console.error("checkout-all" + "\n" + err)
  }
}

init()
