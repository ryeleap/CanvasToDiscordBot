require("dotenv").config();
const canvasApiUrl = process.env.CANVAS_URL;
const canvasApiToken = process.env.CANVAS_TOKEN;

// getActiveCourses();
// getActiveAssignments();

async function getActiveCourses() {
    //get req
    const resp = await fetch(`${canvasApiUrl}/courses?enrollment_state=active`, {
        headers: { Authorization: `Bearer ${canvasApiToken}` },
    });

    if (!resp.ok) {
        throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
    }

    //parse json
    const data = await resp.json();
    console.log("Active courses:");
    data.forEach((c) => {
        console.log(`- ${c.name}`);
    });

    return data;
}

async function getActiveAssignments() {
    const courseResp = await fetch(`${canvasApiUrl}/courses?enrollment_state=active`, {
        headers: { Authorization: `Bearer ${canvasApiToken}` },
    });

    if (!courseResp.ok) {
        throw new Error(`Failed to fetch courses: ${courseResp.status} ${courseResp.statusText}`);
    }

    const courses = await courseResp.json();

    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(now.getDate() + 7);

    let assignmentsDue = [];

    for (const course of courses) {
        const assignResp = await fetch(`${canvasApiUrl}/courses/${course.id}/assignments`, {
            headers: { Authorization: `Bearer ${canvasApiToken}` },
        });

        if (!assignResp.ok) {
            console.warn(`Failed to fetch assignments for course ${course.id}`);
            continue;
        }

        const assignments = await assignResp.json();

        //check if due this week
        const dueThisWeek = assignments.filter(a => {
            if (!a.due_at) return false;
            const dueDate = new Date(a.due_at);
            return dueDate >= now && dueDate <= weekFromNow;
        });

        //if so, push
        dueThisWeek.forEach(a => {
            assignmentsDue.push({
                course: course.name,
                name: a.name,
                due_at: a.due_at,
            });
        });
    }

    return assignmentsDue;
}

//export to index.js
module.exports = { getActiveCourses, getActiveAssignments, getCurrentGrades };
