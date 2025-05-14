const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getHistory = async (req, res) => {
     const agentId  = req.params.id;

  try {
    const clients = await prisma.client.findMany({
      where: {
        user_id: parseInt(agentId),
      },
      include: {
        histories: {
          orderBy: { created_at: 'asc' },
          select: {
            score: true,
            created_at: true,
          },
        },
      },
    });

    const formatted = clients.map(client => ({
      clientId: client.client_id,
      clientName: client.name,
      history: client.histories.map((entry) => ({
        x: entry.created_at,       
        y: entry.score,
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching client history data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}