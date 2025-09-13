require('dotenv').config();
const { getActiveCourses, getActiveAssignments } = require("./canvas");

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
            try {
                await interaction.deferReply();
                const assignments = await getActiveAssignments();
                if (assignments.length === 0) {
                    await interaction.editReply("🎉 No assignments due this week!");
                } else {
                    const list = assignments
                        .map(a => `${a.course}: **${a.name}** (due ${new Date(a.due_at).toLocaleString()})`)
                        .join("\n");
                    await interaction.editReply(`Assignments due this week:\n${list}`);
                }
            } catch (err) {
                console.error(err);
                await interaction.editReply("Couldn't fetch assignments.");
            }
        }
        else if (interaction.commandName === 'courses') {
            try {
                const courses = await getActiveCourses();
                if (courses.length === 0) {
                    await interaction.reply("No active courses found.");
                } else {
                    const list = courses.map(c => `- ${c.name}`).join("\n");
                    await interaction.reply(`Here are your active courses:\n${list}`);
                }
            } catch (err) {
                console.error(err);
                await interaction.reply("Failed to fetch courses from Canvas.");
            }
        }
        else if (interaction.commandName === 'duesoon') {
            await interaction.reply('Due Soon command received!');
        }
    }
})

client.login(process.env.DISCORD_TOKEN);

