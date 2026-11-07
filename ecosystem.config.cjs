module.exports = {
  apps: [
    {
      name: 'yuhan-hsk',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3005
      },
      error_file: './logs/error.log',
      out_file: './logs/access.log',
      merge_logs: true,
      time: true
    }
  ]
};
