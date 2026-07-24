import { prisma } from "../lib/prisma.js";

// GET /api/dashboard/stats
export async function getDashboardStats(req, res) {
  try {
    const userId = req.user.id;

    const [
      totalClients,
      activeClients,
      totalProjects,
      completedProjects,
      totalInvoices,
      paidInvoices,
      totalProposals,
    ] = await Promise.all([
      prisma.client.count({
        where: { userId },
      }),

      prisma.client.count({
        where: {
          userId,
          status: "ACTIVE",
        },
      }),

      prisma.project.count({
        where: { userId },
      }),

      prisma.project.count({
        where: {
          userId,
          status: "COMPLETED",
        },
      }),

      prisma.invoice.count({
        where: {
          project: {
            userId,
          },
        },
      }),

      prisma.invoice.count({
        where: {
          status: "PAID",
          project: {
            userId,
          },
        },
      }),

      prisma.proposal.count({
        where: {
          project: {
            userId,
          },
        },
      }),
    ]);

    return res.status(200).json({
      totalClients,
      activeClients,
      totalProjects,
      completedProjects,
      totalInvoices,
      paidInvoices,
      totalProposals,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats.",
    });
  }
}

// GET /api/dashboard/recent-projects
export async function getRecentProjects(req, res) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return res.json(projects);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent projects.",
    });
  }
}

// GET /api/dashboard/recent-invoices
export async function getRecentInvoices(req, res) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        project: {
          userId: req.user.id,
        },
      },
      include: {
        project: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return res.json(invoices);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent invoices.",
    });
  }
}

// GET /api/dashboard/recent-proposals
export async function getRecentProposals(req, res) {
  try {
    const proposals = await prisma.proposal.findMany({
      where: {
        project: {
          userId: req.user.id,
        },
      },
      include: {
        project: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return res.json(proposals);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent proposals.",
    });
  }
}