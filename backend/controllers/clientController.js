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


exports.getClients = async (req, res) => {
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
        const {interest_score, reason, product_id, client_product_id } = req.body;
        const id = parseInt(req.params.client);

        
        const dataInDb = await prisma.history.create({
            data: {
                client_id: id,
                score: interest_score,
                reason: reason,
                product_id: product_id,
            }
        })

        const interestChange = await prisma.client.update({
            where: { client_id: id},
            data: {
                interest_score: interest_score,
            }
        })

        const clientProduct = await prisma.client_product.update({
            where: {
                    client_product_id: client_product_id,
            },
            data: {
                interest: interest_score,
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



exports.assignProduct = async (req, res) => {
    try{
        
        let { client_id, product_id, interest_score } = req.body;
        [ client_id, product_id, interest_score ] = [parseInt(client_id), parseInt(product_id), parseInt(interest_score)];

        const existingProduct = await prisma.client_product.findFirst({
            where: {
                client_id: client_id,
                product_id: product_id,
            }
        })

        if(existingProduct){
            return res.status(400).json({
                status: "error",
                message: "Product already assigned to this client",
            });
        }

        const dataInDb = await prisma.client_product.create({
            data: {
                client_id: client_id,
                product_id: product_id,
                interest: interest_score,
            }
        })

        res.status(201).json({
            status: "success",
            message: "Product assigned successfully",
            data: dataInDb,
        })
    }catch(error){
        console.log(`Something went wrong: ${error}`);
    }
}



exports.getAllClients = async (req, res) => {
    try{
        
        const dataInDb = await prisma.client.findMany({
            include: {
                agent: true,
            }
        })

        res.status(201).json({
            status: "success",
            message: "Client data fetched successfully",
            data: dataInDb,
        })
    }catch(error){
        res.status(500).json({
            status: "error",
            message: `There is an error: ${error}`,
        });
    }
}



exports.deleteClient = async (req, res) => {

    try{
        const id = parseInt(req.params.client);

        const deleteClientProduct = await prisma.client_product.deleteMany({
            where: {
                client_id: id,
            }
        })

        const deleteHistory = await prisma.history.deleteMany({
            where: {
                client_id: id,
            }
        })

        const deleteInteraction = await prisma.interaction.deleteMany({
            where: {
                client_id: id,
            }
        })
        
        const dataInDb = await prisma.client.delete({
            where: {
                client_id: id,
            }
        })

        res.status(201).json({
            status: "success",
            message: "Client deleted successfully",
            data: dataInDb,
        })
    }catch(error){
        res.status(500).json({
            status: "error",
            message: `There is an error: ${error}`,
        });
    }
}



exports.getClientById = async (req, res) => {
    try{
        const id = parseInt(req.params.client);

        const dataInDb = await prisma.client.findUnique({
            where: {
                client_id: id,
            }
        })

        res.status(201).json({
            status: "success",
            message: "Client data fetched successfully",
            data: dataInDb,
        })
    }catch(error){
        res.status(500).json({
            status: "error",
            message: `There is an error: ${error}`,
        });
    }
}


exports.updateClient = async (req, res) => {
    try{

        const id = parseInt(req.params.client);
        const { name, email, phone, address } = req.body;

        const dataInDb = await prisma.client.update({
            where: {
                client_id: id,
            },
            data: {
                name: name,
                email: email,
                phone: phone,
                address: address,
            }
        })

        res.status(201).json({
            status: "success",
            message: "Client updated successfully",
            data: dataInDb,
        })
        
    }catch(error){
        res.status(500).json({
            status: "error",
            message: `There is an error: ${error}`,
        });
    }
}