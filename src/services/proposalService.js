/*
|--------------------------------------------------------------------------
| Proposal Service — MOCK MODE
|--------------------------------------------------------------------------
|
| TEMPORARY: works against an in-memory array instead of a real backend.
| generate() and optimize() return canned text instead of a real LLM
| response — clearly labeled as mock content so you're never confused
| about whether it's real AI output.
|
*/

let proposals = [
    {
        id: "pr1",
        title: "E-commerce Storefront Proposal",
        projectId: "p3",
        projectName: "E-commerce Storefront",
        tone: "confident",
        content:
            "Dear Vikram,\n\nThank you for the opportunity to propose on your E-commerce Storefront project. Based on our discussion, I recommend a phased 6-week build covering catalog, cart, and checkout, with a fixed budget of ₹4,00,000.\n\nLooking forward to working together.",
        createdAt: "2026-06-18",
    },
];

let idCounter = 100;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const proposalService = {
    async getAll() {
        await delay(300);
        return proposals;

        // TODO(once backend exists): delete the two lines above, uncomment below
        // const response = await api.get("/proposals");
        // return response.data;
    },

    async getById(id) {
        await delay(200);
        const proposal = proposals.find((p) => p.id === id);
        if (!proposal) throw new Error("Proposal not found");
        return proposal;

        // TODO(once backend exists): delete the lines above, uncomment below
        // const response = await api.get(`/proposals/${id}`);
        // return response.data;
    },

    async generate({ projectId, tone, keyPoints }) {
        await delay(700); // fake "AI thinking" time

        const newProposal = {
            id: `pr${idCounter++}`,
            title: "Generated Proposal",
            projectId,
            projectName: "Selected Project",
            tone,
            content: `Dear Client,\n\nThank you for considering me for this project. Based on your requirements${keyPoints ? `, especially ${keyPoints}` : ""
                }, I'm confident I can deliver excellent results within budget and on schedule.\n\n(This is mock AI content — no real backend connected yet.)\n\nLooking forward to working together.`,
            createdAt: new Date().toISOString(),
        };

        proposals.push(newProposal);
        return newProposal;

        // TODO(once backend exists): delete the block above, uncomment below
        // const response = await api.post("/proposals/generate", { projectId, tone, keyPoints });
        // return response.data;
    },

    async optimize(id, instruction) {
        await delay(600);
        const proposal = proposals.find((p) => p.id === id);
        if (!proposal) throw new Error("Proposal not found");

        const optimizedContent = `${proposal.content}\n\n[Revised per instruction: "${instruction}" — mock revision, no real AI connected yet.]`;
        proposal.content = optimizedContent;

        return { content: optimizedContent };

        // TODO(once backend exists): delete the block above, uncomment below
        // const response = await api.post(`/proposals/${id}/optimize`, { instruction });
        // return response.data;
    },

    async delete(id) {
        await delay(200);
        proposals = proposals.filter((p) => p.id !== id);
        return { success: true };

        // TODO(once backend exists): delete the lines above, uncomment below
        // const response = await api.delete(`/proposals/${id}`);
        // return response.data;
    },
};

export default proposalService;