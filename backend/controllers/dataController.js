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
            reason: true,
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
        reason: entry.reason,
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching client history data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


exports.getProductRate = async (req, res) => {

  const agentId = parseInt(req.params.id);

  try {
    const clients = await prisma.client.findMany({
      where: { user_id: agentId },
      select: { client_id: true },
    });

    const clientIds = clients.map(c => c.client_id);

    const topProducts = await prisma.client_product.groupBy({
      by: ['product_id'],
      where: {
        client_id: { in: clientIds },
      },
      _count: {
        product_id: true,
      },
      orderBy: {
        _count: {
          product_id: 'desc',
        },
      },
      take: 10,
    });

    const productIds = topProducts.map(p => p.product_id);

    const products = await prisma.product.findMany({
      where: {
        product_id: { in: productIds },
      },
      select: {
        product_id: true,
        name: true,
      },
    });

    const result = topProducts.map(item => {
      const product = products.find(p => p.product_id === item.product_id);
      return {
        productName: product ? product.name : 'Unknown',
        count: item._count.product_id,
      };
    });

    res.status(200).json({
      status: 'success',
      message: 'Product rate data fetched successfully',
      data: result,
    })
  } catch (error) {
    console.error('Error fetching product rate data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


exports.getTasks = async (req,res) => {
  const agentId = parseInt(req.params.agentId);
  console.log(agentId);
  try {
    const tasks = await prisma.task.findMany({
      where: {
        user_id: agentId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.status(200).json(
      {
        status: 'success',
        message: 'Tasks fetched successfully',
        data: tasks,
      }
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



exports.markTaskDone = async (req, res) => {
  const taskId = parseInt(req.params.taskId);

  try {
    const task = await prisma.task.update({
      where: { task_id: taskId },
      data: { status: 'COMPLETED' },
    });

    res.status(200).json({
      status: 'success',
      message: 'Task marked as done successfully',
      data: task,
    });
  } catch (error) {
    console.error('Error marking task as done:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.getFollowUps = async (req, res) => {
  const { agentId } = req.params;

  try {
    const followUps = await prisma.interaction.findMany({
      where: {
        agent_id: parseInt(agentId),
        next_followup_date: { 
          not: null ,
          gte: new Date(),
        },
      }
    })
    res.status(200).json({
      status: 'success',
      message: 'Follow-ups fetched successfully',
      data: followUps,
    });
  }catch (error) {
    console.error('Error fetching follow-ups:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        agent: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json(
      {
        status: 'success',
        message: 'Tasks fetched successfully',
        data: tasks,
      }
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


exports.getAllProductRate = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      select: { client_id: true },
    });

    const clientIds = clients.map(c => c.client_id);

    const topProducts = await prisma.client_product.groupBy({
      by: ['product_id'],
      where: {
        client_id: { in: clientIds },
      },
      _count: {
        product_id: true,
      },
      orderBy: {
        _count: {
          product_id: 'desc',
        },
      },
      take: 10,
    });

    const productIds = topProducts.map(p => p.product_id);

    const products = await prisma.product.findMany({
      where: {
        product_id: { in: productIds },
      },
      select: {
        product_id: true,
        name: true,
      },
    });

    const result = topProducts.map(item => {
      const product = products.find(p => p.product_id === item.product_id);
      return {
        productName: product ? product.name : 'Unknown',
        count: item._count.product_id,
      };
    });

    res.status(200).json({
      status: 'success',
      message: 'Product rate data fetched successfully',
      data: result,
    })
  }catch (error) {
    console.error('Error fetching product rate data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


exports.getAllHistory = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        histories: {
          orderBy: { created_at: 'asc' },
          select: {
            score: true,
            created_at: true,
            reason: true,
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
        reason: entry.reason,
      })),
    }));

    res.status(200).json(
      {
        status: 'success',
        message: 'Client history data fetched successfully',
        data: formatted,
      }
    );
  } catch (error) {
    console.error('Error fetching client history data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.updateTask = async (req, res) => {
  const taskId = parseInt(req.params.taskId);

  const { status, description, due_date, user_id } = req.body;

  try {
    const task = await prisma.task.update({
      where: { task_id: taskId },
      data: { 
        status: status, 
        description: description,
        due_date: new Date(due_date),
        user_id: parseInt(user_id),
       },
    });

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.deleteTask = async (req, res) => {
  const taskId = parseInt(req.params.taskId);

  try {
    await prisma.task.delete({
      where: { task_id: taskId },
    });

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



exports.createTask = async (req, res) => {
  const { description, status, due_date, user_id } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        description: description,
        status: status,
        due_date: new Date(due_date),
        user_id: parseInt(user_id),
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}