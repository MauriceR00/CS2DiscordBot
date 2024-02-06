const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { API } = require('csgo.js');
const { steamId, datafile } = require('../../index');
const rtt = require('../../methods/roundToTwo');

let kd, hsp, acc;

let mbd = new EmbedBuilder().setColor(1848932).setTimestamp();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('cs2')
		.setDescription('Show CS2 Stats of User')
		.addStringOption(option => 
			option
				.setName('steamid64')
				.setDescription('CS2 Stats von SteamID Abrufen')
				.setRequired(false)),
	async execute(interaction) {
		if(interaction.channelId != datafile[interaction.guildId].mainchannel) return interaction.reply({content: `FEHLER: Bitte benutze den vorgesehenen Channel!`, ephemeral: true });
		const uid = interaction.user.id;
		let sid;
		let user;
		if(interaction.options.getString('steamid64')) {
			sid = interaction.options.getString('steamid64');
		} else {
			if(!datafile[uid]) {
				return interaction.reply({content: `FEHLER: Du hast noch kein Steam Konto mit deinen Discord Account verbunden. Bitte benutze "/steamid STEAMID64"`, ephemeral: true });
			} 
			sid = datafile[uid].steamid;
		}
		try {
        	user = await API.fetchUser(sid, steamId);
		} catch (err) {
			return interaction.reply({content: `FEHLER: Konnte Statistiken von den Benutzer nicht laden!`, ephemeral: true});
		}
		await interaction.deferReply();
        const { kills, deaths, planted_bombs, defused_bombs, knife_kills, headshot_kills, shots_fired, shots_hit, mvps, time_played } = user.stats();
		const { personaname, avatarfull, profileurl } = user.info();
		kd = rtt(kills / deaths);
		hsp = rtt((headshot_kills * 100) / kills);
		acc = rtt((shots_hit * 100) / shots_fired);
		mbd.setThumbnail(avatarfull);
		mbd.setTitle(`CS2 Stats von ${personaname}`);
		mbd.setURL(`${profileurl}`);
        mbd.setFields(
		{ name: 'Kills', value: `${kills}`, inline: true },
		{ name: 'Deaths', value: `${deaths}`, inline: true },
		{ name: 'K/D', value: `${kd}`, inline: true },
		{ name: 'Headshot Kills', value: `${headshot_kills}`, inline: true },
		{ name: 'Headshot %', value: `${hsp}`, inline: true },
		{ name: 'Knife Kills', value: `${knife_kills}`, inline: true },
		{ name: 'Shots Fired', value: `${shots_fired}`, inline: true },
		{ name: 'Shots Hit', value: `${shots_hit}`, inline: true },
		{ name: 'Accuracy %', value: `${acc}`, inline: true },
		{ name: 'Planted Bombs', value: `${planted_bombs}`, inline: true },
		{ name: 'Defused Bombs', value: `${defused_bombs}`, inline: true },
		{ name: 'MVPs', value: `${mvps}`, inline: true },
		{ name: 'Time Played', value: `${time_played.display}`, inline: true }
		);
		return interaction.followUp({embeds: [mbd]});
	},
};
