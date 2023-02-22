const Discord = require('discord.js');

module.exports = {
    name: "",
    description: "",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "",
            description: "",
            type: Discord.ApplicationCommandOptionType,
            required: false,
        },
    ],

    run: async (client, interaction) => { }
};