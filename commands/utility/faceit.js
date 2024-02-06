const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { API } = require('csgo.js');
const { steamId, faceitId, datafile } = require('../../index');
const FC = require('faceit-js-api');
const faceit = new FC(faceitId);

let mbd = new EmbedBuilder().setColor(1848932).setTimestamp();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('faceit')
		.setDescription('Show FaceIT Stats of User'),
	async execute(interaction) {
		if(interaction.channelId != datafile[interaction.guildId].mainchannel) return interaction.reply({content: `FEHLER: Bitte benutze den vorgesehenen Channel!`, ephemeral: true });
		const uid = interaction.user.id;
		if(!datafile[uid]) return interaction.reply({content: `FEHLER: Du hast noch kein Steam Konto mit deinen Discord Account verbunden. Bitte benutze "/steamid STEAMID64"`, ephemeral: true });
		const sid = datafile[uid].steamid;
		const fcid = datafile[uid].faceitid;
		if(!fcid) return interaction.reply({content: `FEHLER: Es wurde kein FaceIT Konto zu deinen Discord Account gebunden! Benutze "/removesteamid" und verbinde erneut mit "/steamid STEAMID64"`, ephemeral: true });
		await interaction.deferReply();
		const user = await API.fetchUser(sid, steamId);
		const { personaname, avatarfull, profileurl } = user.info();
		let fid = await faceit.getPlayerInfo(sid).then(function (player) {
			return player;
        });

		let fis = await faceit.getPlayerStats(fcid, 'csgo').then(function (player) {
			return player;
		});

		mbd.setThumbnail(avatarfull);
		mbd.setTitle(`FaceIT Stats von ${personaname}`);
		mbd.setURL(`${profileurl}`);
        mbd.setFields(
		{ name: 'Matches Played', value: `${fis.lifetime["Matches"]}`, inline: true },
		{ name: 'Matches Won', value: `${fis.lifetime["Wins"]}`, inline: true },
		{ name: 'Win Streak', value: `${fis.lifetime["Current Win Streak"]}`, inline: true },
		{ name: 'Average K/D', value: `${fis.lifetime["Average K/D Ratio"]}`, inline: true },
		{ name: 'Winrate', value: `${fis.lifetime["Win Rate %"]}`, inline: true },
		{ name: 'Longest Win Streak', value: `${fis.lifetime["Longest Win Streak"]}`, inline: true },
		{ name: 'Average Headshot %', value: `${fis.lifetime["Average Headshots %"]}`, inline: true },
		{ name: 'FaceIt Level', value: `${fid.games.csgo.skillLevel}`, inline: true },
		{ name: 'ELO', value: `${fid.games.csgo.faceitElo}`, inline: true },
		{ name: 'Last 5 Matches', value: `${fis.lifetime["Recent Results"].toString().replace(/,/g, "").replace(/0/g, ":x:").replace(/1/g, ":trophy:").replace("null", "")}`, inline: true }
		);
		return interaction.followUp({embeds: [mbd]});
	},
};