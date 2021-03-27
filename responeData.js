const accessNotAllowed = {
	status: 400,
	error: {
		code: 'access not allowed',
		message: 'please contact the developer to create your own api key',
		contact: {
			email: 'sobhanbera258@gmail.com',
		},
	},
}

const invalidQuery = {
	status: 404,
	error: {
		code: 'invalid/query',
		message:
			'fetch query is not valid please try using different query than this one.',
	},
}

const pageNotFound = {
	status: 404,
	error: {
		code: 'page not found',
		message: 'this page is invalid and contains no data for you',
	},
}

const mainResponse = {
	status: 200,
	message:
		"This server is not for commercial use, and should be in only discord server created by the developer. Any Person, Programmer, Developer is not allowed to fetch this server's data without the permissions of developer of this server.",
	developer: 'Sobhan Bera',
	github: 'https://github.com/sobhanbera/discord',
	developerProfile: 'https://github.com/sobhanbera',
	contact:
		'If you want to contribute, or use any of the features of this server, or want template of this server, or want the JS bot related to this server please contact the developer.',
}

module.exports = {
	errorData: {
		invalidQuery,
		accessNotAllowed,
		pageNotFound,
	},
	responseData: {
		mainResponse,
	},
}
