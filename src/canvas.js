require("dotenv").config();
const canvasApiUrl = process.env.CANVAS_URL;
const canvasApiToken = process.env.CANVAS_TOKEN;

async function start() {
    const resp = await fetch(`${canvasApiUrl}/courses?enrollment_state=active`, {
        headers: {
            Authorization: `Bearer ${canvasApiToken}`,
        },
    });

    if (!resp.ok) {
        throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    console.log("Active courses:");
    data.forEach((c) => {
        console.log(`- ${c.name} (id: ${c.id})`);
    });
}

start().catch(console.error);
