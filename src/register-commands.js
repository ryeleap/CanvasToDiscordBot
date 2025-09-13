require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'assignments',
        description: 'Fetch and display your Canvas assignments',
    },
    {
        name: 'courses',
        description: 'Fetch and display your Canvas courses',
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        // await rest.put(
        //     Routes.applicationCommands(process.env.CLIENT_ID),
        //     { body: [] },
        // );

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();