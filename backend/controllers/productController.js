const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllProducts = async (req, res) => {
    try {
        const dataInDb = await prisma.product.findMany({})

        if (dataInDb) {
            res.status(201).json({
                status: "success",
                message: "Client data fetched successfully",
                data: dataInDb,
            })
        }
    } catch (error) {
        console.log(`Something went wrong: ${error}`);
    }

}