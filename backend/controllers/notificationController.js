const schedule = require('node-schedule');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const WebSocket = require('ws'); 

async function scheduleNotifications(agent_id, ws) {
    const interactions = await prisma.interaction.findMany({
        where: {
            agent_id: agent_id,
            next_followup_date: { not: null }
        },
        include: { client: true }
    });

    interactions.forEach(({ next_followup_date, interaction_id, client }) => {
        scheduleJob(next_followup_date, interaction_id, agent_id, ws, client.name);
    });
}

function scheduleJob(date, interaction_id, agent_id, ws, client_name) {
    const followupDate = new Date(date);
    
    if (followupDate > new Date()) {
        schedule.scheduleJob(followupDate, async () => {
            const message = `Reminder: Follow-up with ${client_name}`;
            sendNotification(ws, message); 

            console.log(`Notification sent to agent ${agent_id}: ${message}`);
        });
    }
}

function sendNotification(ws, message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'notification', message }));
    }
}

module.exports = { scheduleNotifications };
