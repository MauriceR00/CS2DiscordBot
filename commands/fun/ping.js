const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
		const now = Date.now();
		await interaction.deferReply({ ephemeral: true });
		await interaction.followUp({content: `Pong! ${Math.round(Date.now() - now)}ms`});
	},
};