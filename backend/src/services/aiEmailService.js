// src/services/aiEmailService.js
import { GoogleGenAI } from "@google/genai";
import { prisma } from "../lib/prisma.js";
import { sendMail } from "./emailServices.js";

/**
 * Service to generate personalized, professional business communication emails
 * using Google Gemini AI based on project, client, proposal, contract, and invoice context.
 *
 * @param {Object} params
 * @param {string} params.type - Email template type (PROPOSAL_EMAIL, CONTRACT_EMAIL, INVOICE_EMAIL, PAYMENT_REMINDER, FOLLOW_UP_EMAIL, THANK_YOU_EMAIL)
 * @param {string} params.projectId - Target project ID
 * @param {string} [params.tone] - Professional, Friendly, Formal, Sales-focused
 * @param {string} [params.language] - English, Hindi, Hinglish
 * @param {string} params.userId - Logged-in user ID for ownership check
 */
export async function generateAiEmailService({ type, projectId, tone = "Professional", language = "English", userId }) {
  // 1. Fetch Project, Client, Proposal, Contract Document, and Invoice with ownership validation
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
      invoices: {
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
  const invoice = project.invoices[0] || null;
  const contract = project.documents[0] || null;

  // 2. Validate Gemini API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // 3. Prepare Context according to Email Type
  const context = {
    emailType: type,
    clientName: client?.name || "Valued Client",
    clientEmail: client?.email || "N/A",
    projectTitle: project.title,
    projectStatus: project.status,
    budget: project.budget ? Number(project.budget) : 0,
    proposal: proposal
      ? {
          budget: Number(proposal.budget),
          timelineWeeks: proposal.timelineWeeks,
          deliverables: proposal.deliverables,
        }
      : null,
    invoice: invoice
      ? {
          number: invoice.number,
          dueDate: invoice.dueDate ? invoice.dueDate.toISOString().split("T")[0] : "TBD",
          taxRate: Number(invoice.taxRate),
          notes: invoice.notes,
        }
      : null,
    contract: contract
      ? {
          title: contract.name,
          date: contract.createdAt ? contract.createdAt.toISOString().split("T")[0] : "Recently",
        }
      : null,
  };

  const systemPrompt = `You are an expert SaaS business communication assistant.
You write emails for freelancers communicating with clients.

Email Type: ${type}
Tone: ${tone}
Language: ${language}

Client Information:
Name: ${context.clientName}
Email: ${context.clientEmail}

Project:
Name: ${context.projectTitle}
Status: ${context.projectStatus}
Budget: $${context.budget}

Business Context Details:
${JSON.stringify(context, null, 2)}

Requirements:
- Match the requested Tone (${tone}) and Language (${language}).
- Friendly yet professional communication with a clear call-to-action.
- Avoid robotic AI wording. Make it conversion-focused and client-centric.

Return ONLY a valid JSON object matching this structure:
{
  "subject": "Compelling Email Subject Line",
  "previewText": "Short 1-line email inbox preview text",
  "body": "Full body text of the email with appropriate line breaks and formatting",
  "followUpSuggestion": "Suggested follow-up timeline or tip",
  "recommendedSendTime": "Recommended time of day to send this email"
}`;

  const userPrompt = `Generate a personalized ${type} for client ${context.clientName} regarding project "${context.projectTitle}".
Ensure tone is ${tone} and language is ${language}. Return JSON only.`;

  // 4. Call Gemini API
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
  const emailData = JSON.parse(rawContent);

  return {
    clientEmail: client?.email || "",
    clientName: client?.name || "",
    subject: emailData.subject || `${type.replace("_", " ")} - ${context.projectTitle}`,
    previewText: emailData.previewText || `Updates regarding ${context.projectTitle}`,
    body: emailData.body || `Hi ${context.clientName},\n\nHope you are doing well.\n\nBest regards,`,
    followUpSuggestion: emailData.followUpSuggestion || "Follow up in 3 business days if no reply.",
    recommendedSendTime: emailData.recommendedSendTime || "Tuesday morning at 10:00 AM",
  };
}

/**
 * Service to send generated email to client using Nodemailer via sendMail.
 */
export async function sendAiEmailService({ to, subject, body, html }) {
  const emailHtml = html || body.replace(/\n/g, "<br>");
  return sendMail({
    to,
    subject,
    html: emailHtml,
  });
}
