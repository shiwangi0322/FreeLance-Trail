// src/services/aiContractService.js
import { GoogleGenAI } from "@google/genai";
import { prisma } from "../lib/prisma.js";

/**
 * Service to generate a legal freelance contract using Google Gemini AI
 * and save it into the Documents database table under CONTRACTS folder.
 *
 * @param {Object} params
 * @param {string} params.projectId - ID of the target project.
 * @param {string} params.userId - Logged in user ID for ownership validation.
 * @returns {Promise<Object|null>} Contract document object or null if project not found.
 */
export async function generateAiContractService({ projectId, userId }) {
  // 1. Fetch Project, Client, and Proposal with Ownership Check
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

  if (!project) {
    return null;
  }

  const client = project.client;
  const proposal = project.proposals[0] || null;

  // 2. Validate Gemini API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // 3. Prepare Prompt Context
  const contractPrompt = `You are an expert freelance contract lawyer.

Create a professional freelance service agreement.

Project Information:

Project Name:
${project.title}

Description:
${project.title} - Professional Freelance Agreement

Client:
${client?.name || "Client"}

Budget:
${proposal?.budget ? `$${proposal.budget}` : project.budget ? `$${project.budget}` : "TBD"}

Timeline:
${proposal?.timelineWeeks ? `${proposal.timelineWeeks} weeks` : "4 weeks"}

Deliverables:
${proposal?.deliverables?.length ? proposal.deliverables.join(", ") : "Project Scope & Key Deliverables"}


Generate a complete contract containing:

1. Contract Title
2. Parties Involved
3. Project Scope
4. Deliverables
5. Timeline and Milestones
6. Payment Terms
7. Revision Policy
8. Intellectual Property Rights
9. Confidentiality Clause
10. Client Responsibilities
11. Freelancer Responsibilities
12. Termination Policy
13. Dispute Resolution
14. Acceptance Section

Make it professional and suitable for freelancers.
Use clear business language.

Return only the contract text.`;

  // 4. Generate Contract Content via Gemini API
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: contractPrompt,
  });

  let contractText = typeof response.text === "function" ? response.text() : response.text;
  if (!contractText) {
    throw new Error("Received empty contract text from Gemini API.");
  }

  contractText = contractText.replace(/^```(?:markdown|text)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // 5. Save generated contract into Documents table
  const documentName = `${project.title} - Service Agreement`;
  
  const savedDocument = await prisma.document.create({
    data: {
      projectId: project.id,
      name: documentName,
      folder: "CONTRACTS",
      sizeMB: 0.1,
      fileUrl: contractText,
    },
  });

  return {
    document: savedDocument,
    contractText,
  };
}
