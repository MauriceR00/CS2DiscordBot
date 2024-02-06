const { SlashCommandBuilder } = require('discord.js');
const { datafile, fs, datapath } = require('../../index');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removesteamid')
		.setDescription('Remove SteamID'),
	async execute(interaction) {
        if(interaction.channelId != datafile[interaction.guildId].mainchannel) return interaction.reply({content: `FEHLER: Bitte benutze den vorgesehenen Channel!`, ephemeral: true });       
        const uid = interaction.user.id;
        if(datafile[uid]) {
            delete datafile[uid];
            fs.writeFileSync(datapath, JSON.stringify(datafile, null, 2));
            return interaction.reply({content: `Dein Verbundener Steam Account wurde entfernt!`, ephemeral: true });
        } else {
            return interaction.reply({content: `FEHLER: Es wurde kein Account zum entfernen gefunden!`, ephemeral: true});
        }
	},
};