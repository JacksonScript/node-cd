Private = {
	server: {port: "61440"}, // Port is overriden by env var "WWW_PORT"
	security: {
		authorizedIps:[
			'127.0.0.1',
			'localhost',
			// Bitbucket IPs
			// 131.103.20.165,
			// 131.103.20.166
			// Github's IPs
			// '207.97.227.253',
			// '50.57.128.197',
			// '204.232.175.75',
			// '108.171.174.178'
		],
		authorizedSubnet:[
			'204.232.175.64/27',
			'192.30.252.0/22'
		]
	},
	repositories: {
		"repository-name": {
			// sorry, you can't name a branch secret :(
			secret: "a secret code to copy into the github webhook secret field",
			"master": {
				action: { exec: "./node-cd.sh" }
			},
			"another-branch": {
				action: { exec: "pwd" }
			}
		}
	}
};

module.exports = Private;
