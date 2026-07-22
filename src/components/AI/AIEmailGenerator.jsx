// src/components/ai/AIEmailGenerator.jsx
import { useState } from "react";
import { Mail, Sparkles, Send, Copy, RefreshCw, CheckCircle2, AlertCircle, X, Eye } from "lucide-react";
import aiService from "../../services/aiService";

/**
 * AIEmailGenerator Component
 * Allows freelancers to generate, preview, edit, regenerate, and send AI client communication emails.
 */
export default function AIEmailGenerator({ projectId, initialType = "proposal_email", onClose, onEmailSent }) {
  const [type, setType] = useState(initialType);
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipient, setRecipient] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleGenerate = async () => {
    if (!projectId) {
      setErrorMsg("Please select a valid project.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await aiService.generateEmail({
        type,
        projectId,
        tone,
      });

      if (res?.success && res?.email) {
        setEmailData(res.email);
        setSubject(res.email.subject || "");
        setBody(res.email.body || "");
        setRecipient(res.email.clientEmail || "");
        setSuccessMsg("Email generated successfully!");
      } else {
        setErrorMsg(res?.message || "Unable to generate email.");
      }
    } catch (err) {
      console.error("AI Email Generation Error:", err);
      setErrorMsg(err.response?.data?.message || "Unable to generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipient || !subject || !body) {
      setErrorMsg("Recipient email, subject, and body are required to send.");
      return;
    }

    setSending(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await aiService.sendEmail({
        to: recipient,
        subject,
        body,
      });

      if (res?.success) {
        setSuccessMsg("Email sent successfully!");
        if (onEmailSent) onEmailSent(res);
      } else {
        setErrorMsg(res?.message || "Failed to send email.");
      }
    } catch (err) {
      console.error("Send Email Error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to send email. Check SMTP setup.");
    } finally {
      setSending(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl max-w-2xl w-full mx-auto my-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">AI Email Writer 🤖</h3>
            <p className="text-xs text-gray-500">Auto-generate professional client communications</p>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Select Email Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 px-2.5 text-xs focus:border-violet-400 focus:outline-none"
          >
            <option value="proposal_email">Proposal Email</option>
            <option value="contract_email">Contract Email</option>
            <option value="invoice_email">Invoice Email</option>
            <option value="invoice_reminder">Payment Reminder</option>
            <option value="follow_up">Follow Up</option>
            <option value="thank_you">Thank You</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Select Tone:</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 px-2.5 text-xs focus:border-violet-400 focus:outline-none"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="short">Short</option>
            <option value="formal">Formal</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-xs font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-60 transition mb-4"
      >
        {loading ? (
          <>
            <RefreshCw size={14} className="animate-spin" />
            <span>Generating email...</span>
          </>
        ) : (
          <>
            <Sparkles size={14} />
            <span>Generate Email</span>
          </>
        )}
      </button>

      {/* Generated Result */}
      {emailData && (
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Client Email:</label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="client@company.com"
              className="w-full rounded-lg border border-gray-200 py-2 px-3 text-xs focus:border-violet-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 px-3 text-xs font-medium focus:border-violet-400 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-700">Message:</label>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-1 text-[11px] text-violet-600 hover:underline"
              >
                <Eye size={12} />
                <span>{previewMode ? "Edit Mode" : "Preview Mode"}</span>
              </button>
            </div>

            {previewMode ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed text-gray-800 whitespace-pre-wrap font-sans min-h-[160px]">
                {body}
              </div>
            ) : (
              <textarea
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-3 text-xs leading-relaxed focus:border-violet-400 focus:outline-none"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              <Copy size={13} />
              <span>{copied ? "Copied!" : "Copy Email"}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                <RefreshCw size={13} />
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                onClick={handleSendEmail}
                disabled={sending}
                className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Send Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <CheckCircle2 size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-rose-600">
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
