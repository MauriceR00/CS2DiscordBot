const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { API } = require('csgo.js');
const { steamId, datafile } = require('../../index');
const rtt = require('../../methods/roundToTwo');

let wi, pl, wir;

let mbd = new EmbedBuilder().setColor(1848932).setTimestamp();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('Show CSGO Stats of User from specified Map')
        .addStringOption(option =>
            option.setName('map')
            .setDescription('Select Map')),
	async execute(interaction) {
		if(interaction.channelId != datafile[interaction.guildId].mainchannel) return interaction.reply({content: `FEHLER: Bitte benutze den vorgesehenen Channel!`, ephemeral: true });
		const uid = interaction.user.id;
		if(!datafile[uid]) return interaction.reply({content: `FEHLER: Du hast noch kein Steam Konto mit deinen Discord Account verbunden. Bitte benutze "/steamid STEAMID64"`, ephemeral: true });
        const mapn = interaction.options.getString('map');
        if(!mapn) return interaction.reply({content: `FEHLER: Du musst eine Map angeben! (cs_italy, cs_office, de_cbble, de_dust2, de_dust, de_inferno, de_nuke, de_train, de_house, de_vertigo, ar_shoots, ar_baggage, de_lake, de_stmarc, de_shorttrain)`, ephemeral: true});
        const sid = datafile[uid].steamid;
        const user = await API.fetchUser(sid, steamId);
        const maps = user.maps();
        const map = maps[mapn];
        if(!map) return interaction.reply({content: `FEHLER: Du musst eine gültige Map angeben! (cs_italy, cs_office, de_cbble, de_dust2, de_dust, de_inferno, de_nuke, de_train, de_house, de_vertigo, ar_shoots, ar_baggage, de_lake, de_stmarc, de_shorttrain)`, ephemeral: true});
        await interaction.deferReply();
        wi = map.wins;
        pl = map.played;
        wir = rtt(map.wr * 100);
		const { personaname, avatarfull, profileurl } = user.info();
		mbd.setThumbnail(avatarfull);
		mbd.setTitle(`Mapstatistik (${mapn.toUpperCase()}) von ${personaname}`);
		mbd.setURL(`${profileurl}`);
        mbd.setFields(
        { name: 'Wins', value: `${wi}`, inline: true },
        { name: 'Played', value: `${pl}`, inline: true },
        { name: 'Win Rate %', value: `${wir}`, inline: true }
		);
		return interaction.followUp({embeds: [mbd]});
	},
};