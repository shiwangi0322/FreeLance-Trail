// src/components/projects/ProjectCard.jsx
import { useState } from "react";
import { FileText, Receipt, Sparkles, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import aiService from "../../services/aiService";
import AIEmailGenerator from "../email/AIEmailGenerator";

/**
 * ProjectCard Component
 * Displays project summary card with buttons for AI Proposal, AI Contract, AI Invoice, and AI Email Writer.
 */
export default function ProjectCard({ project, onActionSuccess }) {
  const [activeAction, setActiveAction] = useState(null); // 'proposal' | 'contract' | 'invoice' | null
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailType, setEmailType] = useState("PROPOSAL_EMAIL");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerateProposal = async () => {
    if (!project?.id) return;
    setActiveAction("proposal");
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await aiService.generateProposal(project.id);
      if (response?.success || response?.proposal) {
        setSuccessMessage("Proposal created successfully");
        if (onActionSuccess) onActionSuccess("proposal", response);
      } else {
        setErrorMessage(response?.message || "Failed to generate proposal.");
      }
    } catch (err) {
      console.error("Proposal Generation Error:", err);
      setErrorMessage(
        err.response?.data?.message || "Failed to generate proposal. Please try again."
      );
    } finally {
      setActiveAction(null);
    }
  };

  const handleGenerateContract = async () => {
    if (!project?.id) return;
    setActiveAction("contract");
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await aiService.generateContract(project.id);
      if (response?.success || response?.document) {
        setSuccessMessage("Contract created successfully");
        if (onActionSuccess) onActionSuccess("contract", response);
      } else {
        setErrorMessage(response?.message || "Failed to generate contract.");
      }
    } catch (err) {
      console.error("Contract Generation Error:", err);
      setErrorMessage(
        err.response?.data?.message || "Failed to generate contract. Please try again."
      );
    } finally {
      setActiveAction(null);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!project?.id) return;
    setActiveAction("invoice");
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await aiService.generateInvoice(project.id);
      if (response?.success || response?.invoice) {
        setSuccessMessage("Invoice created successfully");
        if (onActionSuccess) onActionSuccess("invoice", response);
      } else {
        setErrorMessage(response?.message || "Failed to generate invoice.");
      }
    } catch (err) {
      console.error("Invoice Generation Error:", err);
      setErrorMessage(
        err.response?.data?.message || "Failed to generate invoice. Please try again."
      );
    } finally {
      setActiveAction(null);
    }
  };

  const handleOpenEmailModal = (type = "PROPOSAL_EMAIL") => {
    setEmailType(type);
    setShowEmailModal(true);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{project.title}</h3>
          <p className="text-xs text-gray-500">{project.client?.name || project.client || "Client"}</p>
        </div>
        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
          {project.status || "PLANNED"}
        </span>
      </div>

      <div className="mt-4 border-t border-gray-50 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-gray-400">Budget</p>
          <p className="text-sm font-semibold text-gray-900">
            ${project.budget ? Number(project.budget).toLocaleString() : 0}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleGenerateProposal}
            disabled={activeAction !== null}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {activeAction === "proposal" ? (
              <>
                <Loader2 size={13} className="animate-spin text-violet-600" />
                <span>Proposal...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} className="text-violet-600" />
                <span>Generate Proposal</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleGenerateContract}
            disabled={activeAction !== null}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {activeAction === "contract" ? (
              <>
                <Loader2 size={13} className="animate-spin text-violet-600" />
                <span>Contract...</span>
              </>
            ) : (
              <>
                <FileText size={13} className="text-blue-600" />
                <span>Generate Contract</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleGenerateInvoice}
            disabled={activeAction !== null}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {activeAction === "invoice" ? (
              <>
                <Loader2 size={13} className="animate-spin text-violet-600" />
                <span>Invoice...</span>
              </>
            ) : (
              <>
                <Receipt size={13} className="text-emerald-600" />
                <span>Generate Invoice</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleOpenEmailModal("PROPOSAL_EMAIL")}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-2.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-violet-700"
          >
            <Mail size={13} />
            <span>Generate Email</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <CheckCircle2 size={14} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-rose-600">
          <AlertCircle size={14} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* AI Email Generator Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <AIEmailGenerator
            projectId={project.id}
            initialType={emailType}
            onClose={() => setShowEmailModal(false)}
            onEmailSent={() => {
              setSuccessMessage("Email sent successfully!");
              setShowEmailModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
