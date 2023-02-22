const Discord = require('discord.js'), Client = require('../index'), Wait = require('wait'), Transcript = require('discord-html-transcripts');
const { QuickDB } = require('quick.db');
const DB = new QuickDB();

Client.on("interactionCreate", async interaction => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'Panel') {
            let Embed = new Discord.EmbedBuilder().setColor('Random').setTitle('Support Tickets').setDescription('To create a ticket react with 📩').setFooter({ text: "TicketTool.xyz - Ticketing without clutter", iconURL: Client.user.displayAvatarURL() });
            let Row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('Create').setLabel('Create ticket').setEmoji('📩')
            );

            interaction.message.components[0].components[0].data.disabled = true;
            interaction.update({ components: [interaction.message.components[0]] });
            await interaction.guild.channels.cache.get(interaction.values[0]).send({ embeds: [Embed], components: [Row] });
        };
    };

    if (interaction.isButton()) {
        if (interaction.customId === 'Create') {
            if (interaction.guild.channels.cache.find(value => value.topic === interaction.user.id)) return interaction.reply({ content: "> **Warning:** Ticket limit reached, You already have 1 tickets open of the 1 allowed for this panel.", ephemeral: true });

            await DB.add(`AMOUNT_${interaction.guildId}`, 1);
            interaction.deferReply({ ephemeral: true });
            await Wait(1000);

            const Quantidade = String(await DB.get(`AMOUNT_${interaction.guildId}`)).padStart(4, "0");
            let Canal = await interaction.guild.channels.create({
                name: `ticket-${Quantidade}`, type: Discord.ChannelType.GuildText,
                permissionOverwrites: [
                    { id: interaction.guildId, deny: [Discord.PermissionFlagsBits.ViewChannel] },
                    { id: interaction.user.id, allow: [Discord.PermissionFlagsBits.ViewChannel] },
                ]
            });

            let Embed = new Discord.EmbedBuilder().setColor('Random').setDescription('Support will be with you shortly.\nTo close this ticket react with 🔒.').setFooter({ text: "TicketTool.xyz - Ticketing without clutter", iconURL: Client.user.displayAvatarURL() });
            let Row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('Close').setLabel('Close').setEmoji('🔒')
            );

            Canal.setTopic(interaction.user.id);
            Canal.send({ content: `${interaction.user} Welcome.`, embeds: [Embed], components: [Row] });
            return interaction.editReply({ content: `Ticket created ${Canal}`, ephemeral: true });
        };

        if (interaction.customId === 'Close') {
            let Row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Danger).setCustomId('Confirm').setLabel('Close'),
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('Cancel').setLabel('Cancel')
            );

            return interaction.reply({ content: "Are you sure you would like to close this ticket?", components: [Row] });
        };

        if (interaction.customId === 'Cancel') interaction.message.delete();
        if (interaction.customId === 'Confirm') {
            let Embed = new Discord.EmbedBuilder().setColor('Random').setDescription(`Ticket Closed by ${interaction.user}.`);
            let Other_Embed = new Discord.EmbedBuilder().setColor('Random').setDescription('Support team ticket controls.');

            let Row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('Transcript').setLabel('Transcript').setEmoji('📑'),
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('Open').setLabel('Open').setEmoji('🔓'),
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('Delete').setLabel('Delete').setEmoji('⛔')
            );

            interaction.message.delete();
            await interaction.channel.setName(`closed-${interaction.channel.name.slice(-4)}`);
            return interaction.channel.send({ embeds: [Embed, Other_Embed], components: [Row] });
        };

        if (interaction.customId === 'Transcript') return interaction.reply({ files: [await Transcript.createTranscript(interaction.channel)] });

        if (interaction.customId === 'Open') {
            let Embed = new Discord.EmbedBuilder().setColor('Random').setDescription(`Ticket Opened by ${interaction.user}.`);

            interaction.message.delete();
            interaction.channel.permissionOverwrites.edit(interaction.channel.topic, { 'ViewChannel': true, });
            return interaction.reply({ embeds: [Embed] });
        };

        if (interaction.customId === 'Delete') {
            interaction.message.components[0].components[2].data.disabled = true;
            interaction.update({ components: [interaction.message.components[0]] });
            await Wait(5000); return interaction.channel.delete();
        };
    };
});