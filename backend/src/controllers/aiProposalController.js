// src/controllers/aiProposalController.js
import { generateAiProposalService } from "../services/aiProposalService.js";

/**
 * Controller to handle AI proposal generation request.
 * Keeps business logic thin and delegates to aiProposalService.
 *
 * POST /api/ai/proposal/:projectId
 */
export async function generateAiProposal(req, res) {
  const { projectId } = req.params;

  // ─── DEBUG LOGS ────────────────────────────────────────────────────────────
  console.log("[aiProposalController] ─── Incoming Request ───────────────────");
  console.log("[aiProposalController] req.params.projectId :", projectId);
  console.log("[aiProposalController] req.user              :", req.user);
  console.log("[aiProposalController] req.user.id           :", req.user?.id);
  console.log("[aiProposalController] ─────────────────────────────────────────");
  // ───────────────────────────────────────────────────────────────────────────

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "projectId parameter is required.",
    });
  }

  try {
    const proposal = await generateAiProposalService({
      projectId,
      userId: req.user.id,
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      proposal,
    });
  } catch (error) {
    console.error("AI Proposal Generation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI proposal.",
    });
  }
}
