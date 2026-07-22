import api from "./api";

/*
|--------------------------------------------------------------------------
| AI Service
|--------------------------------------------------------------------------
|
| API calls for AI features (Chat, AI Proposal, AI Contract, AI Invoice, AI Email Writer)
|
*/

const aiService = {
    /**
     * Send a chat message to AI assistant
     */
    async sendMessage(messages) {
        const token = localStorage.getItem("token");
        const response = await api.post(
          "/ai/chat", 
          { messages },
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        return response.data;
    },

    /**
     * Generate AI Business Proposal for a given project
     */
    async generateProposal(projectId) {
        const token = localStorage.getItem("token");
        const response = await api.post(
          `/ai/proposal/${projectId}`,
          {},
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        return response.data;
    },

    /**
     * Generate AI Contract for a given project
     */
    async generateContract(projectId) {
        const token = localStorage.getItem("token");
        const response = await api.post(
          `/ai/contract/${projectId}`,
          {},
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        return response.data;
    },

    /**
     * Generate AI Invoice for a given project
     */
    async generateInvoice(projectId) {
        const token = localStorage.getItem("token");
        const response = await api.post(
          `/ai/invoice/${projectId}`,
          {},
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        return response.data;
    },

    /**
     * Generate AI Email for client communication
     */
    async generateEmail(data) {
        const token = localStorage.getItem("token");
        const response = await api.post(
          "/ai/email",
          data,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        return response.data;
    },

    /**
     * Send generated email via Nodemailer
     */
    async sendEmail(data) {
        const token = localStorage.getItem("token");
        const response = await api.post(
          "/ai/email/send",
          data,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        return response.data;
    },
};

export default aiService;