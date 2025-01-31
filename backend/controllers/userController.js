const { PrismaClient } = require('@prisma/client');
const { use } = require('../routes/userRoute');
const prisma = new PrismaClient;

exports.createUser = async (req,res) => {
    try{
        const { email } = req.body;

        const existingUser = await prisma.user.findUnique({
            where : { email },
        })

        if(existingUser){
            return res.status(400).json({
                status : "error",
                message : "User already in use",
            })
        }

        const dataInDb = await prisma.user.create({
           data : {...req.body, role_id: 1},
        })

        if(dataInDb){
            res.status(201).json({
                status : "Success",
                message : "User created successfully",
                data: dataInDb,
            })
        }

    }catch(e){

        res.status(500).json({
            status : "error",
            message : "Something went wrong",
        })
    }
}


exports.getUserById = async (req, res) => {
    try{
        const userId = parseInt(req.params.id);
        const user = await prisma.user.findUnique({
            where : {user_id: userId},
        })


        if(!user){
            return res.status(404).json({
                status: "error",
                message: "User not found",
            })
        }

        res.status(200).json({
            status: "Success",
            data: user,
        })
    }catch(e){
        res.send("Something went wrong");
    }
}