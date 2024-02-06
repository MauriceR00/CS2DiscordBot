const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { API } = require('csgo.js');
const { steamId, datafile } = require('../../index');
const rtt = require('../../methods/roundToTwo');

let hi, sh, ki, acc, kps;

let mbd = new EmbedBuilder().setColor(1848932).setTimestamp();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weapon')
		.setDescription('Show CSGO Stats of User from specified Weapon')
        .addStringOption(option =>
            option.setName('weapon')
            .setDescription('Select Weapon')),
	async execute(interaction) {
		if(interaction.channelId != datafile[interaction.guildId].mainchannel) return interaction.reply({content: `FEHLER: Bitte benutze den vorgesehenen Channel!`, ephemeral: true });
		const uid = interaction.user.id;
		if(!datafile[uid]) return interaction.reply({content: `FEHLER: Du hast noch kein Steam Konto mit deinen Discord Account verbunden. Bitte benutze "/steamid STEAMID64"`, ephemeral: true });
        const wpn = interaction.options.getString('weapon');
        if(!wpn) return interaction.reply({content: `FEHLER: Du musst eine Waffe angeben! (deagle, glock, elite, fiveseven, awp, ak47, aug, famas, g3sg1, p90, mac10, ump45, xm1014, m249, hkp2000, p250, sg556, scar20, ssg08, mp7, mp9, nova, negev, sawedoff, bizon, tec9, mag7, m4a1, galilar)`, ephemeral: true});
        const sid = datafile[uid].steamid;
        const user = await API.fetchUser(sid, steamId);
        const weapons = user.weapons();
        const weapon = weapons[wpn];
        if(!weapon) return interaction.reply({content: `FEHLER: Du musst eine gültige Waffe angeben! (deagle, glock, elite, fiveseven, awp, ak47, aug, famas, g3sg1, p90, mac10, ump45, xm1014, m249, hkp2000, p250, sg556, scar20, ssg08, mp7, mp9, nova, negev, sawedoff, bizon, tec9, mag7, m4a1, galilar)`, ephemeral: true});
        await interaction.deferReply();
        hi = weapon.hits;
        sh = weapon.shots;
        ki = weapon.kills;
        acc = rtt(weapon.accuracy * 100);
        kps = weapon.kills_per_shot;
		const { personaname, avatarfull, profileurl } = user.info();
		mbd.setThumbnail(avatarfull);
		mbd.setTitle(`Waffenstatistik (${wpn.toUpperCase()}) von ${personaname}`);
		mbd.setURL(`${profileurl}`);
        mbd.setFields(
        { name: 'Shots', value: `${sh}`, inline: true },
        { name: 'Hits', value: `${hi}`, inline: true },
        { name: 'Kills', value: `${ki}`, inline: true },
		{ name: 'Accuracy %', value: `${acc}`, inline: true },
		{ name: 'Kills per shot', value: `${kps}`, inline: true }
		);
		return interaction.followUp({embeds: [mbd]});
	},
};