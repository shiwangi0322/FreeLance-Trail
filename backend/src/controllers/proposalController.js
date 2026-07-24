import { prisma } from "../lib/prisma.js";

// POST /api/proposals
export async function createProposal(req, res) {
  const {
    projectId,
    timelineWeeks,
    budget,
    deliverables,
    status,
  } = req.body;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "projectId is required.",
    });
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const proposal = await prisma.proposal.create({
      data: {
        projectId,
        timelineWeeks: timelineWeeks ?? 4,
        budget: budget ?? 0,
        deliverables: deliverables ?? [],
        status: status ?? "DRAFT",
      },
    });

    return res.status(201).json(proposal);
  } catch (error) {
    console.error("Create proposal error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create proposal.",
    });
  }
}

// GET /api/proposals
export async function getProposals(req, res) {
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
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(proposals);
  } catch (error) {
    console.error("Get proposals error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch proposals.",
    });
  }
}

// GET /api/proposals/:id
export async function getProposalById(req, res) {
  try {
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user.id,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found.",
      });
    }

    return res.status(200).json(proposal);
  } catch (error) {
    console.error("Get proposal error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch proposal.",
    });
  }
}

// PUT /api/proposals/:id
export async function updateProposal(req, res) {
  const {
    timelineWeeks,
    budget,
    deliverables,
    status,
  } = req.body;

  try {
    const existing = await prisma.proposal.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user.id,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found.",
      });
    }

    const proposal = await prisma.proposal.update({
      where: {
        id: req.params.id,
      },
      data: {
        timelineWeeks: timelineWeeks ?? existing.timelineWeeks,
        budget: budget ?? existing.budget,
        deliverables: deliverables ?? existing.deliverables,
        status: status ?? existing.status,
      },
    });

    return res.status(200).json(proposal);
  } catch (error) {
    console.error("Update proposal error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update proposal.",
    });
  }
}

// DELETE /api/proposals/:id
export async function deleteProposal(req, res) {
  try {
    const existing = await prisma.proposal.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user.id,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found.",
      });
    }

    await prisma.proposal.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      message: "Proposal deleted successfully",
    });
  } catch (error) {
    console.error("Delete proposal error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete proposal.",
    });
  }
}