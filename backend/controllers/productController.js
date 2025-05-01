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
    try {
        const newProduct = await prisma.product.create({
            data: {
                name: name,
                description: description,
                price: price,
                status: status,
                admin_id: user_id,
            }
        })

        if (newProduct) {
            res.status(201).json({
                status: "success",
                message: "Product created successfully",
                data: newProduct,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Error creating product",
            error: error.message,
        });
    }
}


exports.editProduct = async (req, res) => {
    const { product_id } = req.params;
    const { name, description, price, status } = req.body;

    try {
        const updatedProduct = await prisma.product.update({
            where: { product_id: parseInt(product_id) },
            data: {
                name,
                description,
                price,
                status,
            },
        });

        if (updatedProduct) {
            res.status(200).json({
                status: "success",
                message: "Product updated successfully",
                data: updatedProduct,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Error updating product",
            error: error.message,
        });
    }
}

exports.deleteProduct = async (req, res) => {
    const { product_id } = req.params;

    try {

        const deleteRelation = await prisma.client_product.deleteMany({
            where: { product_id: parseInt(product_id) },
        })

        if (deleteRelation) {
            const deletedProduct = await prisma.product.delete({
                where: { product_id: parseInt(product_id) },
            });

            if (deletedProduct) {
                res.status(200).json({
                    status: "success",
                    message: "Product deleted successfully",
                    data: deletedProduct,
                });
            }

        }

    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Error deleting product",
            error: error.message,
        });
    }
}


exports.getClientByProduct = async (req, res) => {
    const { product_id } = req.query;
    try {
        const clientData = await prisma.client_product.findMany({
            where: { product_id: parseInt(product_id) },
            include: {
                client: true,
            },
        });

        if (clientData) {
            res.status(200).json({
                status: "success",
                message: "Client data fetched successfully",
                data: clientData,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Error fetching client data",
            error: error.message,
        });
    }
}