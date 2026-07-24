// src/services/aiProposalService.js
import { GoogleGenAI } from "@google/genai";
import { prisma } from "../lib/prisma.js";

/**
 * Service to generate a structured AI Business Proposal using Google Gemini API.
 * Follows strict ownership validation and updates or creates a Proposal record in Prisma.
 *
 * @param {Object} params
 * @param {string} params.projectId - ID of the project to generate a proposal for.
 * @param {string} params.userId - ID of the logged-in user for ownership validation.
 * @returns {Promise<Object|null>} Structured proposal object or null if project not found.
 */
export async function generateAiProposalService({ projectId, userId }) {
  // ─── DEBUG LOGS ────────────────────────────────────────────────────────────
  console.log("[aiProposalService] ─── Service Called ───────────────────────");
  console.log("[aiProposalService] Received projectId :", projectId);
  console.log("[aiProposalService] Received userId    :", userId);
  console.log("[aiProposalService] typeof projectId   :", typeof projectId);
  console.log("[aiProposalService] typeof userId      :", typeof userId);
  // ───────────────────────────────────────────────────────────────────────────

  // 1. Ownership & Existence Verification
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: userId,
    },
    include: {
      client: true,
      proposals: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  // ─── DEBUG LOGS ────────────────────────────────────────────────────────────
  console.log("[aiProposalService] Prisma project result:", project ? `FOUND (id: ${project.id}, userId: ${project.userId})` : "NULL - NOT FOUND");
  if (!project) {
    // Fetch project WITHOUT userId filter to check if it exists at all
    const projectExists = await prisma.project.findUnique({ where: { id: projectId } });
    console.log("[aiProposalService] Project exists in DB (any user):", projectExists ? `YES (userId in DB: ${projectExists.userId})` : "NO - Project ID invalid");
    console.log("[aiProposalService] userId from JWT      :", userId);
    console.log("[aiProposalService] userId stored in DB  :", projectExists?.userId);
    console.log("[aiProposalService] IDs match?           :", projectExists?.userId === userId);
  }
  // ───────────────────────────────────────────────────────────────────────────

  if (!project) {
    return null;
  }

  const client = project.client;
  const existingProposal = project.proposals[0] || null;

  // 2. Validate Gemini API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // 3. Construct Context & Prompt
  const promptContext = {
    projectTitle: project.title,
    projectStatus: project.status,
    budget: project.budget ? Number(project.budget) : 0,
    startDate: project.startDate ? project.startDate.toISOString().split("T")[0] : "TBD",
    endDate: project.endDate ? project.endDate.toISOString().split("T")[0] : "TBD",
    clientName: client?.name || "Valued Client",
    clientEmail: client?.email || "N/A",
    existingProposal: existingProposal
      ? {
          timelineWeeks: existingProposal.timelineWeeks,
          budget: Number(existingProposal.budget),
          deliverables: existingProposal.deliverables,
        }
      : null,
  };

  const systemPrompt = `You are a world-class freelance consultant and professional business proposal writer. 
Generate a polished, persuasive, and comprehensive business proposal tailored to the client's project details.

You MUST respond strictly with a valid JSON object without markdown formatting, code blocks, or preamble.
The JSON object MUST contain the following key fields:
1. "overview": A detailed executive summary of the project.
2. "objectives": Strategic goals and project objectives.
3. "scope": Specific scope of work outlining what is included and excluded.
4. "deliverables": Array of string items representing key concrete deliverables.
5. "timeline": Estimated duration, key milestones, and turnaround time.
6. "budgetSummary": Professional cost breakdown and pricing model explanation.
7. "technologies": Array of string technology recommendations or tools to be used.
8. "terms": Standard payment, IP rights, and revisions terms.
9. "closing": A warm, professional call-to-action closing statement.`;

  const userPrompt = `Project Details:
- Title: ${promptContext.projectTitle}
- Status: ${promptContext.projectStatus}
- Allocated Budget: $${promptContext.budget}
- Start Date: ${promptContext.startDate}
- End Date: ${promptContext.endDate}

Client Details:
- Name: ${promptContext.clientName}
- Email: ${promptContext.clientEmail}

${
  promptContext.existingProposal
    ? `Existing Proposal Draft Context:
- Current Timeline: ${promptContext.existingProposal.timelineWeeks} weeks
- Current Budget: $${promptContext.existingProposal.budget}
- Current Deliverables: ${JSON.stringify(promptContext.existingProposal.deliverables)}`
    : "No prior proposal exists for this project."
}

Generate the full, structured proposal JSON matching the required fields.`;

  // 4. Invoke Google Gemini API
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: userPrompt,
    config: {
      responseMimeType: "application/json",
      systemInstruction: systemPrompt,
    },
  });

  // Safely extract text content regardless of whether response.text is a getter property or a method in @google/genai
  let rawContent = typeof response.text === "function" ? response.text() : response.text;

  if (!rawContent) {
    throw new Error("Received empty response from Gemini API.");
  }

  // Safely strip code fence backticks if present
  rawContent = rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  const aiData = JSON.parse(rawContent);

  const structuredProposal = {
    overview: aiData.overview || "Comprehensive project overview tailored to requirements.",
    objectives: aiData.objectives || "High-impact goals designed for optimal results.",
    scope: aiData.scope || "Full-cycle planning, development, testing, and deployment.",
    deliverables: Array.isArray(aiData.deliverables) ? aiData.deliverables : ["Primary System Architecture", "Production Deployment"],
    timeline: aiData.timeline || "Estimated project timeline: 4 weeks.",
    budgetSummary: aiData.budgetSummary || `Total Estimated Cost: $${promptContext.budget}`,
    technologies: Array.isArray(aiData.technologies) ? aiData.technologies : ["Node.js", "Express", "Prisma", "PostgreSQL"],
    terms: aiData.terms || "50% upfront deposit required, remaining 50% upon final delivery.",
    closing: aiData.closing || "We look forward to collaborating with you to bring this project to fruition.",
  };

  // 5. Save or Update Proposal in Prisma Database
  const timelineWeeks = parseInt(structuredProposal.timeline.match(/\d+/)?.[0] || "4", 10);
  const budgetValue = promptContext.budget > 0 ? promptContext.budget : 0;
  const deliverables = structuredProposal.deliverables;

  if (existingProposal) {
    await prisma.proposal.update({
      where: { id: existingProposal.id },
      data: {
        timelineWeeks: timelineWeeks > 0 ? timelineWeeks : existingProposal.timelineWeeks,
        budget: budgetValue > 0 ? budgetValue : existingProposal.budget,
        deliverables: deliverables,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.proposal.create({
      data: {
        projectId: project.id,
        timelineWeeks: timelineWeeks > 0 ? timelineWeeks : 4,
        budget: budgetValue,
        deliverables: deliverables,
        status: "DRAFT",
      },
    });
  }

  return structuredProposal;
}
