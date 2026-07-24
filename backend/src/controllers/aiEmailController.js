// src/controllers/aiEmailController.js

import {
  generateAiEmailService,
  sendAiEmailService,
} from "../services/aiEmailService.js";

/**
 * POST /api/ai/email/:projectId
 */
export async function generateEmailController(req, res) {
  console.log("\n========== GENERATE AI EMAIL ==========");
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  console.log("User:", req.user);

  const projectId = req.params.projectId;
  const {
    type,
    tone = "Professional",
    language = "English",
  } = req.body;

  console.log("Project ID:", projectId);
  console.log("Type:", type);

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "projectId is required.",
    });
  }

  if (!type) {
    return res.status(400).json({
      success: false,
      message: "type is required.",
    });
  }

  try {
    const email = await generateAiEmailService({
      projectId,
      type,
      tone,
      language,
      userId: req.user.id,
    });

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      email,
    });
  } catch (err) {
    console.error("AI EMAIL ERROR:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI email.",
      error: err.message,
    });
  }
}

/**
 * POST /api/ai/email/:projectId/send
 */
export async function sendEmailController(req, res) {
  console.log("\n========== SEND EMAIL ==========");
  console.log("Params:", req.params);
  console.log("Body:", req.body);

  const { to, subject, body, html } = req.body;

  if (!to || !subject || (!body && !html)) {
    return res.status(400).json({
      success: false,
      message: "to, subject and body/html are required.",
    });
  }

  try {
    const result = await sendAiEmailService({
      to,
      subject,
      body,
      html,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
      result,
    });
  } catch (err) {
    console.error("SEND EMAIL ERROR:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to send email.",
      error: err.message,
    });
  }
}