const { SlashCommandBuilder } = require('discord.js');
const { API } = require('csgo.js');
const { steamId, faceitId, datafile, fs, datapath } = require('../../index');
const FC = require('faceit-js-api');
const faceit = new FC(faceitId);


function hasValueDeep(json, findValue) {
    const values = Object.values(json);
    let hasValue = values.includes(findValue);
    values.forEach(function(value) {
        if (typeof value === "object") {
            hasValue = hasValue || hasValueDeep(value, findValue);
        }
    })
    return hasValue;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('steamid')
		.setDescription('Set SteamID')
        .addStringOption(option =>
            option
                .setName('steamid64')
                .setDescription('Input your SteamID64')
                .setRequired(true)),
	async execute(interaction) {
        if(interaction.channelId != datafile[interaction.guildId].mainchannel) return interaction.reply({content: `FEHLER: Bitte benutze den vorgesehenen Channel!`, ephemeral: true });
        const sid = interaction.options.getString('steamid64');
        const uid = interaction.user.id;
        const user = await API.fetchUser(sid, steamId).catch(err => interaction.reply({content: `FEHLER: Bitte gib eine gültige STEAMID64 an!`, ephemeral: true }));
        const { personaname } = user.info();
        if(!user) return interaction.reply({content: `FEHLER: Konnte Nutzer nicht bestätigen!`, ephemeral: true });
        if(datafile[uid]) return interaction.reply({content: `FEHLER: Du hast bereits einen Account verbunden!`, ephemeral: true });
        if(hasValueDeep(datafile, sid)) return interaction.reply({content: `FEHLER: Du hast bereits einen Account verbunden!`, ephemeral: true });
        let fid = await faceit.getPlayerInfo(sid).then(function (player) {
            return JSON.stringify(player.id).replace(/"/g, '');
        });
        if(fid) datafile[uid] = { steamid: sid, faceitid: fid };
        if(!fid) datafile[uid] = { steamid: sid };

        fs.writeFileSync(datapath, JSON.stringify(datafile, null, 2));

		return interaction.reply({content: `Steam Account "${personaname}" mit SteamID "${sid}" wurde zu deinen Discord Account gebunden`, ephemeral: true });
	},
};