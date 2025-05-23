const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { scheduleJob } = require('../controllers/notificationController');
const { getWebSocketForAgent } = require('../wsManager');

exports.createInteraction = async (req, res) => {
    
    try{
        const {type, date, summary, followUpDate, notes, client_id, agent_id} = req.body;

        const dateOfInteraction = new Date(date);
        const nextFollowUpDate = followUpDate ? new Date(followUpDate) : null;

        const dataToInsert = {
            client_id: parseInt(client_id),
            agent_id: parseInt(agent_id), 
            interaction_date: dateOfInteraction,
            interaction_type: type,
            summary: summary,
            next_followup_date: nextFollowUpDate,
            notes: notes || null
        };

        const dataInDb = await prisma.interaction.create({
            data: dataToInsert,
            include: {
                client: true,
                agent: true
            }
        });

        if(dataInDb.next_followup_date){
            const ws = getWebSocketForAgent(agent_id);
            if(ws){
                scheduleJob(dataInDb.next_followup_date, dataInDb.interaction_id, dataInDb.agent_id, ws, dataInDb.client.name);
            }
        }

        res.status(201).json({
            status: "success",
            message: "Interaction created successfully",
            data: dataInDb,
        });

    } catch(error) {
        console.error("Error creating interaction:", error);
        res.status(500).json({
            status: "error",
            message: `Internal server error: ${error.message}`
        });
    } finally {
        await prisma.$disconnect();
    }
}




exports.getInteractionsByAgentId = async (req, res) => {
    try {
        
        const dataInDb = await prisma.interaction.findMany({
            where: {
                agent_id: parseInt(req.params.agent_id),
            },
            include: {
                client: true,
            }
        })

        if(dataInDb.length === 0){
            return res.status(404).json({
                status: "error",
                message: "No interactions found"
            })
        }

        return res.status(200).json({
            status : 'success',
            data : dataInDb,
        })
            
    }catch(error){
        console.error("Error fetching interactions:", error);
        res.status(500).json({
            status: "error",
            message: `Internal server error: ${error.message}`
        });
    } 
}



exports.getAllInteraction = async (req, res) => {
    try{

        const dataInDb = await prisma.interaction.findMany({
            include: {
                client: true,
                agent: true,
            }
        })

        if (dataInDb) {
            res.status(201).json({
                status: "Success",
                message: "Interaction data fetched successfully",
                data: dataInDb,
            })
        }
        
    }catch(error){
        res.status(500).json({
            status: "error",
            message : "Something went wrong",
        })
    }
}



exports.deleteInteraction = async (req, res) => {
    const id = parseInt(req.params.id);
    try{

        const dataInDb = await prisma.interaction.delete({
            where : {
                interaction_id: id,
            }
        })

        if (dataInDb) {
            res.status(201).json({
                status: "Success",
                message: "Interaction deleted successfully",
                data: dataInDb,
            })
        }
        
    }catch(error){
        res.status(500).json({
            status: "error",
            message : "Something went wrong",
        })
    }
}