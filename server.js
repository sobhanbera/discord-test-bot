const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()

// constants
const roleAllotmentChannelID = '823818475054563339'
let clientIsReadyAndWorking = false
let rollAssignRequest = 0
let rollTakingRequest = 0
let deleteRequest = 0
let totalMessagesSent = 0
let messageDeleteByUser = 0

// functions
const addReactions = (message, reactions) => {
	message.react(reactions[0])
	reactions.shift()
	if (reactions.length > 0) {
		setTimeout(() => addReactions(message, reactions), 100)
	}
}

const nthMessage = async (id, text, reactions = []) => {
	const channel = await client.channels.fetch(id)

	channel.messages.fetch().then((messages) => {
		if (messages.size === 0) {
			// Send a new message
			channel.send(text).then((message) => {
				addReactions(message, reactions)
			})
		} else {
			// Edit the existing message
			for (const message of messages) {
				message[1].edit(text)
				addReactions(message[1], reactions)
			}
		}
	})
}

const getEmoji = (value) =>
	client.emojis.cache.find((emoji) => emoji.name === value)

// actions
const roleAllotment = () => {
	const langEmojis = {
		CPrevious: 'C',
		CPP: 'CPP',
		Java: 'Java',
		Python: 'Python',
		Kotlin: 'Kotlin',
		C_: 'C#',
		golang: 'golang',
		Javascript: 'Javascript',
		Typescript: 'Typescript',
		HTMLCSSPHP: 'HTML-CSS-PHP',
		otherlangs: 'other-lang',
	}
	const techEmojis = {
		webDeveloper: 'web-developer',
		androidDeveloper: 'android-developer',
		AI: 'ai',
		gameDeveloper: 'game-developer',
		frontend: 'frontend',
		backend: 'backend',
		UI: 'ui-ux',
		// developer: 'developer', this will we given by admins, coadmins,
		// high-level-authorities or by the owner of the server
	}
	const otherTechEmojis = {
		github: 'open-source-contributor',
		competitive_programmer: 'competitive-programmer',
	}
	const allEmojis = {
		...langEmojis,
		...techEmojis,
		...otherTechEmojis,
	}

	const reactions = []
	let emojiText = `\nReact · Message · To · Get · Your · Roles!\n\nIn this section, you will be able to assign some of the roles to yourself (only which are available as reactions).\nReact to that particular programming language's reaction if you are close with that programming language. In this way, you could send messages on particular channels.\nThe following emojis are related to the some programming languages:-\n\n`

	for (let i in langEmojis) {
		const emoji = getEmoji(i)
		reactions.push(emoji)

		const role = langEmojis[i]
		emojiText += `\t\t${emoji} - ${role}\n\n`
	}

	emojiText += `Now,\nReact to that particular technical field's reaction if you have worked with that technology. In this way, you could send messages on particular channels.\nThe following emojis are related to some technologies:-\n\n`

	for (let i in techEmojis) {
		const emoji = getEmoji(i)
		reactions.push(emoji)

		const role = techEmojis[i]
		emojiText += `\t\t${emoji} - ${role}\n\n`
	}

	emojiText += 'Some Other Roles are:- \n\n'
	for (let i in otherTechEmojis) {
		const emoji = getEmoji(i)
		reactions.push(emoji)

		const role = otherTechEmojis[i]
		emojiText += `\t\t${emoji} - ${role}\n\n`
	}

	emojiText += `An Example:-\nYou reacted to the C emoji below then you could send messages in the C language channel, under languages category.\n`
	// emojiText += `An Example:-\nYou reacted to the android robot emoji below then you could send messages in the android-developer channel, under technologies category.\n`

	nthMessage(roleAllotmentChannelID, emojiText, reactions)

	const onSettingRole = async (toAdd, reaction, user) => {
		if (user.id === '825031593134653462') return
		const emoji = reaction._emoji.name

		const { guild } = reaction.message
		const roleName = allEmojis[emoji]
		//		if (
		//			!roleName ||
		//			roleName === null ||
		//			roleName === '' ||
		//			roleName === undefined
		//		) {
		//			return
		//		}

		if (!roleName) return

		const role = guild.roles.cache.find((role) => role.name === roleName)
		const memberToAssignTheRole = guild.members.cache.find(
			(member) => member.id === user.id
		)

		if (toAdd) memberToAssignTheRole.roles.add(role)
		else memberToAssignTheRole.roles.remove(role)
	}

	// getting the reaction press event..
	// may be it could be adding reaction or removing reaction...
	client.on('messageReactionAdd', (reaction, user) => {
		if (reaction.message.channel.id === roleAllotmentChannelID) {
			if (!allEmojis[reaction._emoji.name]) {
				reaction.remove()
				return
			}
			onSettingRole(true, reaction, user)

			rollAssignRequest++
		}
	})

	client.on('messageReactionRemove', (reaction, user) => {
		if (reaction.message.channel.id === roleAllotmentChannelID) {
			onSettingRole(false, reaction, user)

			rollTakingRequest++
		}
	})
}

// listeners
client.on('ready', () => {
	clientIsReadyAndWorking = true
	console.log('Bot Connected to Server Successfully. ', client.user.tag)

	client.user.setActivity('Music', { type: 'LISTENING' })
	client.user.setUsername('Everytime Programmer')

	// actions usages...
	roleAllotment()
	//	rollAssignRequest = 0
	//	rollTakingRequest = 0
	//	deleteRequest = 0
	//	totalMessagesSent = 0
})

client.on('message', (message) => {
	if (
		message.channel.id === '819458715328446487' || //music control channel
		message.channel.id === '823818389776498688' //commands channel
	) {
		return
	} else {
		if (['!', '$', '~', '/', '-'].includes(message.content.charAt(0))) {
			deleteRequest++
			message.delete()
		} else if (message.content.substr(0, 5) === 'etpsb') {
			deleteRequest++
			message.delete()
		}
		totalMessagesSent++
	}
})

client.on('messageDelete', () => {
	messageDeleteByUser++
})

client.login(process.env.DISCORD_SERVER_TOKEN)

// this is the express server so that no issues occurs on the backend side...
const express = require('express')
const { responseData, errorData } = require('./responeData')

const app = express()
const PORT = process.env.PORT// only for dev purpose || 8000

app.get('/', (req, res) => {
	if (req.query.key !== process.env.KEY) {
		res.status(400).send(errorData.accessNotAllowed)
	} else {
		res.status(200).send({
			status: {
				code: 200,
				message: 'data loaded successfully.',
			},
			serverInfo: {
				activity: {
					active: clientIsReadyAndWorking,
				},
				requests: {
					rollAssignmentRequests: rollAssignRequest,
					rollTakingRequests: rollTakingRequest,
					commandMessageDeleted: deleteRequest,

					messageDeleteByUser,
					totalRequestsMade:
						rollAssignRequest + rollTakingRequest + deleteRequest,

					totalMessagesSent,
				},
			},
			holder: {
				owner: 'sobhanbera',
			},
			more: {
				...responseData.mainResponse,
			},
		})
	}
})

app.get('/*', (req, res) => {
	res.status(400).send(errorData.pageNotFound)
})

app.listen(PORT, () =>
	console.log(`backend server has been started at port: ${PORT}`)
)

//
//
