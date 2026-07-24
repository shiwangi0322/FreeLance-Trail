// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import clientsRoutes from "./routes/clients.js";
import projectsRoutes from "./routes/projects.js";
import documentsRoutes from "./routes/documents.js";
import invoicesRoutes from "./routes/invoices.js";
import proposalsRoutes from "./routes/proposals.js";
import dashboardRoutes from "./routes/dashboard.js";
import aiProposalRoutes from "./routes/aiProposal.js";
import aiContractRoutes from "./routes/aiContract.js";
import aiInvoiceRoutes from "./routes/aiInvoice.js";
import aiEmailRoutes from "./routes/aiEmail.js";
import pdfRoutes from "./routes/pdf.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: only allow requests from your frontend's dev URL (Vite) — adjust
// CLIENT_ORIGIN in .env when you deploy the frontend to a real domain.
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

// Simple health check — useful for confirming the server is up, and
// required by most hosting platforms (Render) to verify the app is alive.
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/proposals", proposalsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiProposalRoutes);
app.use("/api/ai", aiContractRoutes);
app.use("/api/ai", aiInvoiceRoutes);
app.use("/api/ai", aiEmailRoutes);
app.use("/api/pdf", pdfRoutes);

// Catch-all 404 for any unmatched API route.
app.use("/api", (req, res) => {
    res.status(404).json({ error: `No route found for ${req.method} ${req.originalUrl}` });
});

// Central error handler — catches anything thrown/rejected that wasn't
// already caught inside a route's own try/catch.
app.use((err, req, res, next) => {
    console.error("Unhandled server error:", err);
    res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
    console.log(`✔ Server running on http://localhost:${PORT}`);
});