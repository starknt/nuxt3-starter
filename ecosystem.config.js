module.exports = {
  apps: [
    {
      name: 'Starsky Chat',
      port: '5173',
      exec_mode: 'cluster',
      instances: '2',
      script: './.output/server/index.mjs',
    },
  ],
}
