const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { datafile, fs, datapath } = require('../../index');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setmainchannel')
		.setDescription('Set main channel for the commands to work')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
        datafile[interaction.guildId] = { mainchannel: interaction.channelId };
        fs.writeFileSync(datapath, JSON.stringify(datafile, null, 2));
		await interaction.reply({content: `Hauptchannel für den Server wurde gesetzt!`, ephemeral: true});
	},
};