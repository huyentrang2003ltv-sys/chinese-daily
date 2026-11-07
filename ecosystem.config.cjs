module.exports = {
  apps: [
    {
      name: 'chinese-daily',
      script: 'server.js',
      cwd: '/opt/chinese-daily',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
        STORAGE_DIR: '/opt/chinese-daily/storage'
      },
      error_file: '/var/log/chinese-daily/error.log',
      out_file: '/var/log/chinese-daily/access.log',
      merge_logs: true,
      time: true
    }
  ]
};
