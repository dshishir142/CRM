const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addClient = async (req, res) => {

    try {
        const { email } = req.body;

        const existingEmail = await prisma.client.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return res.status(400).json({
                status: "error",
                message: "Email already exists",
            });
        }

        const{ name, phone, address, interest_score, agent } = req.body

        const dataInDb = await prisma.client.create({
            data: {
                name: name,
                email: email,
                phone: phone,
                address: address,
                interest_score: interest_score,
                agent: {
                    connect: {user_id: agent}
                }
            },
        });


        if(dataInDb){

            const clientProduct = await prisma.client_product.create({
                data: {
                    client_id: dataInDb.client_id,
                    product_id: parseInt(req.body.product_id),
                    interest: req.body.interest_score,
                }
            })
        }

        return res.status(201).json({
            status: "success",
            message: "Client created successfully",
            data: dataInDb,
        });

    } catch (error) {
        console.error("Error adding client:", error);
        return res.status(500).json({
            status: "error",
            message: `There is an error: ${error}`,
        });
    }
};


exports.getAllClient = async (req, res) => {
    try{
        const agent_id = parseInt(req.params.agent);
        
        const dataInDb = await prisma.client.findMany({
            where: {
                user_id : agent_id,
            }
        })

        res.status(201).json({
            status: "success",
            message: "Client data fetched successfully",
            data: dataInDb,
        })
    }catch(error){
        console.log(`Something went wrong: ${error}`);
    }
}





exports.changeInterestScore = async (req, res) => {
    
    try{
        const {interest_score, reason } = req.body;
        const id = parseInt(req.params.client);

        
        const dataInDb = await prisma.history.create({
            data: {
                client_id: id,
                score: interest_score,
                reason: reason,
            }
        })

        const interestChange = await prisma.client.update({
            where: { client_id: id},
            data: {
                interest_score: interest_score,
            }
        })

        res.status(201).json({
            status: "success",
            message: "Interest score changed successfully",
            data: dataInDb,
        })

    }catch(error){
        console.log(`Something went wrong: ${error}`);
    }
}




exports.getClientProduct = async (req, res) => {
    try{
        const agent_id = parseInt(req.params.agent);
        
        const dataInDb = await prisma.client_product.findMany({
            where: {
                client: {
                    user_id : agent_id,
                }
            },
            include: {
                client: true,
                product: true,
            }
        })

        res.status(201).json({
            status: "success",
            message: "Client data fetched successfully",
            data: dataInDb,
        })
    }catch(error){
        console.log(`Something went wrong: ${error}`);
    }
}
