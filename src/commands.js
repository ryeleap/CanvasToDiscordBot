const { getActiveCourses, getActiveAssignments, getCurrentGrades } = require("./canvas");

async function handleActiveCoursesCommand(interaction) {
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

async function handleAssignmentsCommand(interaction) {
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

async function handleCurrGradesCommand(interaction) {
    try {
        await interaction.deferReply();

        const grades = await getCurrentGrades();

        if (grades.length === 0) {
            await interaction.editReply("No grade data available yet.");
        } else {
            const list = grades
                .map(g => `${g.course}: **${g.current_grade || "N/A"}** (${g.current_score ?? "N/A"}%)`)
                .join("\n");
            await interaction.editReply(`Your current grades:\n${list}`);
        }
    } catch (err) {
        console.error(err);
        await interaction.editReply("Couldn't fetch grades.");
    }
}


module.exports = { handleActiveCoursesCommand, handleAssignmentsCommand, handleCurrGradesCommand };
