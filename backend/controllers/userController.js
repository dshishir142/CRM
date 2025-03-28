const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient;

exports.createUser = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "User already in use",
            })
        }

        const dataInDb = await prisma.user.create({
            data: { ...req.body, role_id: 1},
        })

        if (dataInDb) {
            res.status(201).json({
                status: "Success",
                message: "User created successfully",
                data: dataInDb,
            })
        }

    } catch (e) {

        res.status(500).json({
            status: "error",
            message: "Something went wrong",
        })
    }
}


exports.getUserByEmail = async (req, res) => {
    try {

        const email = req.params.email;
        const user = await prisma.user.findUnique({
            where: { email: email },
        })


        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            })
        }

        res.status(200).json({
            status: "Success",
            data: user,
        })
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
        })
    }
}


exports.getUserForLogin = async (req, res) => {

    try {

        const { name, email, password } = req.body;
        const userData = await prisma.user.findFirst({
            where: {
                name: name,
                email: email,
                password: password,
            }
        })

        if (!userData) {
            return res.status(400).json({
                status: "error",
                message: "Wrong credentials please try again",
            })
        }

        res.status(200).json({
            status: "success",
            message: "login successful",
            data: userData,
        })

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
        })
    }
}


exports.updateUser = async (req, res) => {
    const {name, email, password} = req.body;

    const updateData = {
        name: name,
        password: password,
    }

    if(req.body.image){
        updateData.image = req.body.image;
    }

    try{

        const dataInDb = await prisma.user.update({
            where : {email : email},
            data : updateData,
        })

        if (dataInDb) {
            res.status(201).json({
                status: "Success",
                message: "User updated successfully",
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