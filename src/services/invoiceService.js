/*
|--------------------------------------------------------------------------
| Invoice Service — MOCK MODE
|--------------------------------------------------------------------------
|
| TEMPORARY: works against an in-memory array instead of a real backend.
| projectId values below (p1/p2/p4) match projectService.js's mock
| projects, so Invoices.jsx's project/client-name lookups work correctly.
|
*/

let invoices = [
    { id: "i1", invoiceNumber: "INV-2026-0001", projectId: "p4", amount: 60000, dueDate: "2026-06-15", status: "paid", notes: "" },
    { id: "i2", invoiceNumber: "INV-2026-0002", projectId: "p1", amount: 100000, dueDate: "2026-07-20", status: "sent", notes: "" },
    { id: "i3", invoiceNumber: "INV-2026-0003", projectId: "p2", amount: 30000, dueDate: "2026-06-28", status: "overdue", notes: "" },
];

let idCounter = 100;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const invoiceService = {
    async getAll() {
        await delay(300);
        return invoices;

        // TODO(once backend exists): delete the two lines above, uncomment below
        // const response = await api.get("/invoices");
        // return response.data;
    },

    async getById(id) {
        await delay(200);
        const invoice = invoices.find((i) => i.id === id);
        if (!invoice) throw new Error("Invoice not found");
        return invoice;

        // TODO(once backend exists): delete the lines above, uncomment below
        // const response = await api.get(`/invoices/${id}`);
        // return response.data;
    },

    async create(invoiceData) {
        await delay(300);
        const newInvoice = {
            id: `i${idCounter}`,
            invoiceNumber: `INV-2026-${String(idCounter++).padStart(4, "0")}`,
            ...invoiceData,
        };
        invoices.push(newInvoice);
        return newInvoice;

        // TODO(once backend exists): delete the lines above, uncomment below
        // const response = await api.post("/invoices", invoiceData);
        // return response.data;
    },

    async update(id, invoiceData) {
        await delay(300);
        const index = invoices.findIndex((i) => i.id === id);
        if (index === -1) throw new Error("Invoice not found");
        invoices[index] = { ...invoices[index], ...invoiceData };
        return invoices[index];

        // TODO(once backend exists): delete the lines above, uncomment below
        // const response = await api.put(`/invoices/${id}`, invoiceData);
        // return response.data;
    },

    async delete(id) {
        await delay(200);
        invoices = invoices.filter((i) => i.id !== id);
        return { success: true };

        // TODO(once backend exists): delete the lines above, uncomment below
        // const response = await api.delete(`/invoices/${id}`);
        // return response.data;
    },

    async markAsPaid(id) {
        await delay(200);
        const index = invoices.findIndex((i) => i.id === id);
        if (index === -1) throw new Error("Invoice not found");
        invoices[index].status = "paid";
        return invoices[index];

        // TODO(once backend exists): delete the lines above, uncomment below
        // const response = await api.patch(`/invoices/${id}/mark-paid`);
        // return response.data;
    },

    async sendReminder(id) {
        await delay(300);
        return { success: true, message: "Reminder email sent (mock)" };

        // TODO(once backend exists): delete the two lines above, uncomment below
        // const response = await api.post(`/invoices/${id}/remind`);
        // return response.data;
    },
};

export default invoiceService;