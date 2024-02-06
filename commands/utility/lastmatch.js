const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { API } = require('csgo.js');
const { steamId, datafile } = require('../../index');
const rtt = require('../../methods/roundToTwo');

let kd;

let mbd = new EmbedBuilder().setColor(1848932).setTimestamp();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lastmatch')
		.setDescription('Show CSGO Stats of User from last casual match'),
	async execute(interaction) {
		if(interaction.channelId != datafile[interaction.guildId].mainchannel) return interaction.reply({content: `FEHLER: Bitte benutze den vorgesehenen Channel!`, ephemeral: true });
		const uid = interaction.user.id;
		if(!datafile[uid]) return interaction.reply({content: `FEHLER: Du hast noch kein Steam Konto mit deinen Discord Account verbunden. Bitte benutze "/steamid STEAMID64"`, ephemeral: true });
		await interaction.deferReply();
		const sid = datafile[uid].steamid;
        const user = await API.fetchUser(sid, steamId);
        const { last_match_t_wins, last_match_ct_wins, last_match_wins, last_match_kills, last_match_deaths, last_match_mvps, last_match_damage, last_match_money_spent, last_match_rounds } = user.lastMatch();
		const { personaname, avatarfull, profileurl } = user.info();
		kd = rtt(last_match_kills / last_match_deaths);
		mbd.setThumbnail(avatarfull);
		mbd.setTitle(`CSGO Stats vom letzten Spiel von ${personaname}`);
		mbd.setURL(`${profileurl}`);
        mbd.setFields(
        { name: 'Kills', value: `${last_match_kills}`, inline: true },
        { name: 'Deaths', value: `${last_match_deaths}`, inline: true },
        { name: 'K/D', value: `${kd}`, inline: true },
		{ name: '# Rounds', value: `${last_match_rounds}`, inline: true },
		{ name: 'CT Wins', value: `${last_match_ct_wins}`, inline: true },
		{ name: 'T Wins', value: `${last_match_t_wins}`, inline: true },
		{ name: 'Rounds won', value: `${last_match_wins}`, inline: true },
		{ name: 'MVPs', value: `${last_match_mvps}`, inline: true },
		{ name: 'Damage Done', value: `${last_match_damage}`, inline: true },
		{ name: 'Money Spent', value: `${last_match_money_spent}`, inline: true }
		);
		return interaction.followUp({embeds: [mbd]});
	},
};