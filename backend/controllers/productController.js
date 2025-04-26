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

exports.addProduct = async (req, res) => {
    const { name, description, price, status, user_id } = req.body;
    try{
        const newProduct = await prisma.product.create({
            data: {
                name: name,
                description: description,
                price: price,
                status: status,
                admin_id: user_id,
            }
        })

        if(newProduct) {
            res.status(201).json({
                status: "success",
                message: "Product created successfully",
                data: newProduct,
            });
        }
    }catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Error creating product",
            error: error.message,
        });
    }
}