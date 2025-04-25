const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const { body } = require('framer-motion/client');

exports.getEmails = async (req, res) => {
    const { email, appPassword } = req.query;

    const config = {
        imap: {
            user: email,
            password: appPassword,
            host: "imap.gmail.com",
            port: 993,
            tls: true,
            authTimeout: 10000,
            tlsOptions: { rejectUnauthorized: false }
        }
    };

    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        const searchCriteria = ['ALL'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            struct: true,
            limit: 10 
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        const emails = messages.map(async (message) => {

            const headerPart = message.parts.find(part => part.which === "HEADER");
            const textPart = message.parts.find(part => part.which === "TEXT");
            const fullBodyPart = message.parts.find(part => part.which === "");

            if (!headerPart) return null; 

            const header = headerPart.body;
            const rawEmailBody = fullBodyPart ? fullBodyPart.body : textPart?.body || "";

            const parsedEmail = await simpleParser(rawEmailBody);

            return {
                from: header.from ? header.from[0] : parsedEmail.from?.text || "Unknown",
                subject: header.subject ? header.subject[0] : parsedEmail.subject || "No Subject",
                date: parsedEmail.date || "No Date",
                text: parsedEmail.text || parsedEmail.html || "No Content",
            };
        });

        const emailResults = (await Promise.all(emails)).filter(email => email !== null);

        res.status(200).json(emailResults);

        connection.end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch emails' });
    }
};



exports.sendEmail = async (req, res) => {
    const { user, to, subject, text, pass, user_id } = req.body;
    
    try{
        let transporter = nodemailer.createTransport({
            service : "gmail",
            auth: {
                user : user,
                pass : pass,
            },
        });

        let mailOptions = {
            from: user,
            to: to,
            subject: subject,
            text: text,
        }

        let info = await transporter.sendMail(mailOptions)

        const findClient = await prisma.client.findUnique({
            where: {
                email: to,
            }
        })

        let client_id = null;
        if(findClient){
            clientId = findClient.client_id
        }

        const dataInDb = await prisma.email.create({
            data: {
                to:to,
                user_id: user_id,
                subject: subject,
                body: text,
                status: 'PENDING',
                client_id: clientId || null,
            }
        })

        res.status(201).json({
            status: "success",
            message: "Mail sent successfully",
            data: dataInDb,
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            status : 'error',
            message: "Failed to send mail",
        })
    }
}


exports.getAllEmails = async (req, res) => {
    try {
        const emails = await prisma.email.findMany({
            include: {
                agent: true,
                client: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        res.status(200).json({
            status: 'success',
            data: emails,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch emails',
        });
    }
}