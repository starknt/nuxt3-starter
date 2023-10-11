import Git from 'simple-git'

const git = Git()

const hash = await git.revparse(['main'])

console.debug('Checkout release branch')
await git.checkout('release')

console.debug(`Reset to main branch (${hash})`)
await git.reset(['--hard', hash])

console.debug('Push to release branch')
await git.push(['--force'])

console.debug('Checkout main branch')
await git.checkout('main')
