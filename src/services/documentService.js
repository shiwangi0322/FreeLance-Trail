/*
|--------------------------------------------------------------------------
| Document Service — MOCK MODE
|--------------------------------------------------------------------------
|
| TEMPORARY: returns fake data directly instead of calling a real
| backend. This is why you were seeing "ERR_CONNECTION_REFUSED" —
| there's no Express server running on :5000 yet. Rather than requiring
| you to run a separate backend project just to stop that error, this
| file fakes the responses so the Documents page works right now.
|
| Switch back to real API calls later: uncomment the block at the
| bottom of each method and delete the mock line above it, once your
| real Express backend exists and has these routes built.
|
*/

const mockDocuments = [
    {
        id: "d1",
        title: "Brand Identity Contract",
        type: "contract",
        projectName: "Brand Identity Refresh",
        status: "ready",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        createdAt: "2026-06-20",
    },
    {
        id: "d2",
        title: "Marketing Campaign Proposal",
        type: "proposal",
        projectName: "Marketing Campaign Assets",
        status: "ready",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        createdAt: "2026-06-25",
    },
];

// Tiny helper to fake network latency so loading spinners are visible
// during development, instead of resolving instantly.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const documentService = {
    async getAll() {
        await delay(300);
        return mockDocuments;

        // TODO(once backend exists): delete the two lines above, uncomment below
        // const response = await api.get("/documents");
        // return response.data;
    },

    async getById(id) {
        await delay(200);
        const doc = mockDocuments.find((d) => d.id === id);
        if (!doc) throw new Error("Document not found");
        return doc;

        // TODO(once backend exists): delete the lines above, uncomment below
        // const response = await api.get(`/documents/${id}`);
        // return response.data;
    },

    async delete(id) {
        await delay(200);
        const index = mockDocuments.findIndex((d) => d.id === id);
        if (index !== -1) mockDocuments.splice(index, 1);
        return { success: true };

        // TODO(once backend exists): delete the lines above, uncomment below
        // const response = await api.delete(`/documents/${id}`);
        // return response.data;
    },
};

export default documentService;