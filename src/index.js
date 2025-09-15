require('dotenv').config();
const { handleAssignmentsCommand, handleActiveCoursesCommand, handleCurrGradesCommand } = require("./commands");

//refs are here https://discordjs.guide/creating-your-bot/main-file.html#running-your-application
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds], });
const { Events } = require('discord.js');

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'assignments') {
            await handleAssignmentsCommand(interaction);
        }
        else if (interaction.commandName === 'courses') {
            await handleActiveCoursesCommand(interaction);
        }
        else if (interaction.commandName === 'grades') {
            await handleCurrGradesCommand(interaction);
        }
    }
})

client.login(process.env.DISCORD_TOKEN);

