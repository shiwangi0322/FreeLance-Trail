// src/services/aiInvoiceService.js
import { GoogleGenAI } from "@google/genai";
import { prisma } from "../lib/prisma.js";

/**
 * Service to generate an AI-powered invoice for a project using Google Gemini API
 * and store the created Invoice and InvoiceItems into the database.
 *
 * @param {Object} params
 * @param {string} params.projectId - ID of the target project.
 * @param {string} params.userId - Logged-in user ID for ownership validation.
 * @returns {Promise<Object|null>} Generated invoice database record or null if project not found.
 */
export async function generateAiInvoiceService({ projectId, userId }) {
  // 1. Verify project ownership and fetch project, client, proposal, and contract documents
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
      documents: {
        where: { folder: "CONTRACTS" },
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
  const contract = project.documents[0] || null;

  // 2. Validate Gemini API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // 3. Construct Gemini Prompt Context
  const systemPrompt = `You are an expert freelance finance assistant.
Create a professional invoice for a freelance project.

Rules:
- Use Indian Rupees (INR).
- Create realistic freelancer pricing.
- Break work into milestones or deliverables.
- Add GST calculation (default 18%).
- Calculate subtotal, gstAmount, and totalAmount correctly.
- Do not invent fake client company details if missing.

Return ONLY valid JSON matching this exact structure:
{
  "invoiceTitle": "Invoice Title",
  "invoiceDescription": "Invoice Description",
  "currency": "INR",
  "items": [
    {
      "name": "Milestone / Deliverable Name",
      "description": "Item description",
      "quantity": 1,
      "rate": 50000,
      "amount": 50000
    }
  ],
  "subtotal": 50000,
  "gstPercentage": 18,
  "gstAmount": 9000,
  "totalAmount": 59000,
  "paymentTerms": "Payment due within 14 days of issue.",
  "dueDate": "2026-08-15"
}`;

  const userPrompt = `Project Information:
Name: ${project.title}
Description: ${project.title} - Freelance Development & Services
Timeline: ${proposal?.timelineWeeks ? `${proposal.timelineWeeks} weeks` : "4 weeks"}

Client Information:
Name: ${client?.name || "Client"}
Company: ${client?.name || "Client Company"}

Proposal Content:
${proposal ? `Deliverables: ${proposal.deliverables.join(", ")}, Budget: ₹${proposal.budget}` : "Standard project scope"}

Contract Content:
${contract ? `Contract Title: ${contract.name}` : "Standard Service Agreement"}

Generate the invoice details following the JSON format.`;

  // 4. Call Google Gemini API
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: userPrompt,
    config: {
      responseMimeType: "application/json",
      systemInstruction: systemPrompt,
    },
  });

  let rawContent = typeof response.text === "function" ? response.text() : response.text;
  if (!rawContent) {
    throw new Error("Received empty response from Gemini API.");
  }

  rawContent = rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const aiData = JSON.parse(rawContent);

  // 5. Parse items and prepare Prisma invoice creation
  const invoiceNumber = `INV-${Date.now()}`;
  const taxRate = aiData.gstPercentage || 18;
  const items = Array.isArray(aiData.items) && aiData.items.length > 0
    ? aiData.items
    : [
        {
          name: project.title,
          description: "Freelance Professional Services",
          quantity: 1,
          rate: Number(project.budget) || 0,
          amount: Number(project.budget) || 0,
        },
      ];

  const parsedDueDate = aiData.dueDate ? new Date(aiData.dueDate) : null;
  const validDueDate = parsedDueDate && !isNaN(parsedDueDate.getTime())
    ? parsedDueDate
    : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const notesText = [
    aiData.invoiceDescription,
    aiData.paymentTerms ? `Payment Terms: ${aiData.paymentTerms}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  // 6. Create Invoice & InvoiceItems in PostgreSQL via Prisma
  const invoice = await prisma.invoice.create({
    data: {
      projectId: project.id,
      number: invoiceNumber,
      status: "DRAFT",
      taxRate: taxRate,
      notes: notesText || "Thank you for your business!",
      dueDate: validDueDate,
      items: {
        create: items.map((item) => ({
          name: item.name || "Service Item",
          description: item.description || "",
          qty: item.quantity || item.qty || 1,
          rate: item.rate || item.price || 0,
        })),
      },
    },
    include: {
      items: true,
      project: {
        select: {
          id: true,
          title: true,
          client: true,
        },
      },
    },
  });

  return {
    invoice,
    aiData,
  };
}
