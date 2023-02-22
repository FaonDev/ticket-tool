const Discord = require('discord.js');

module.exports = {
    name: "setup",
    description: "Setup and configuration editor.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "Você não possui permissão de utilizar este comando.", ephemeral: true });
        let Row = new Discord.ActionRowBuilder().addComponents(
            new Discord.StringSelectMenuBuilder().setPlaceholder('Select a channel to send panel.').setCustomId('Panel')
        );

        await interaction.guild.channels.fetch().then(response => {
            response.forEach(element => {
                if (element.type != 0) return;
                Row.components[0].addOptions({ label: element.name.toUpperCase(), value: element.id });
            });
        });

        return interaction.reply({ content: "Ticket Tool basic config editor.", components: [Row], ephemeral: true });
    }
};