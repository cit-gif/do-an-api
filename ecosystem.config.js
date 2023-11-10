module.exports = {
	apps: [
		{
			name: 'do-an-api-prod', // pm2 start App name
			script: './bin/www.js',
			exec_mode: 'cluster', // 'cluster' or 'fork'
			instance_var: 'INSTANCE_ID', // instance variable
			instances: 2, // pm2 instance count
			autorestart: true, // auto restart if process crash
			watch: false, // files change automatic restart
			ignore_watch: ['node_modules', 'logs'], // ignore files change
			max_memory_restart: '1G', // restart if process use more than 1G memory
			merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
			output: './logs/access.log', // pm2 log file
			error: './logs/error.log', // pm2 error log file
			env: {
				// environment variable
				PORT: 3000,
				NODE_ENV: 'production',
			},
		},
	],

	deploy: {
		production: {
			user: 'SSH_USERNAME',
			host: 'SSH_HOSTMACHINE',
			ref: 'origin/master',
			repo: 'GIT_REPOSITORY',
			path: 'DESTINATION_PATH',
			'pre-deploy-local': '',
			'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
			'pre-setup': '',
		},
	},
};
