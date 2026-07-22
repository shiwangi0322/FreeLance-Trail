// src/data/mockAIAssistant.example.js
// Reference only — replace each of these with real calls to aiService.js
// once wired up (e.g. aiService.generateProposal(projectId), etc).

export const mockDefaultContext = {
    currentProject: { name: "Website Redesign", status: "In Progress" },
    currentClient: { name: "Creative Minds Co.", status: "Active" },
    documents: [
        { id: 1, name: "Project Brief.pdf", size: "2.4 MB", type: "PDF" },
        { id: 2, name: "Wireframes.zip", size: "18.7 MB", type: "ZIP" },
        { id: 3, name: "Brand Guidelines.pdf", size: "3.1 MB", type: "PDF" },
    ],
    activity: [
        { id: 1, label: "Proposal generated", time: "Just now" },
        { id: 2, label: "Document summarized", time: "2 hours ago" },
        { id: 3, label: "Invoice created", time: "Yesterday" },
        { id: 4, label: "Meeting notes generated", time: "2 days ago" },
    ],
    suggestions: [
        { id: 1, label: "Improve proposal", description: "Make it more compelling" },
        { id: 2, label: "Shorten document", description: "Summarize key points" },
        { id: 3, label: "Draft follow-up email", description: "Send to Creative Minds Co." },
        { id: 4, label: "Create invoice", description: "From proposal" },
    ],
};

export const mockResultData = {
    proposal: {
        project: "Website Redesign",
        client: "Creative Minds Co.",
        timelineWeeks: 8,
        budget: 350000,
        deliverables: ["UI Design", "Development", "Testing", "Deployment"],
    },
    summary: {
        fileName: "Q4 Financial Report 2024.pdf",
        summary:
            "The Q4 Financial Report 2024 highlights strong financial performance and strategic growth across key areas. The company reported a 28% increase in total revenue compared to Q3, driven by increased demand and successful product launches.",
        highlights: [
            "Total Revenue increased by 28% to ₹12.8 Cr compared to Q3",
            "Net Profit grew by 35% to ₹2.9 Cr, with improved operational efficiency",
            "Operating Expenses reduced by 8% due to cost optimization initiatives",
            "Strong cash flow with ₹4.1 Cr in operating activities",
            "Significant growth in new customer acquisition across enterprise segment",
        ],
        metrics: [
            { label: "Total Revenue", value: "₹12.8 Cr", change: 28 },
            { label: "Net Profit", value: "₹2.9 Cr", change: 35 },
            { label: "Operating Expenses", value: "₹6.7 Cr", change: 8 },
            { label: "EBITDA", value: "₹3.6 Cr", change: 30 },
            { label: "Cash Flow (Operating)", value: "₹4.1 Cr", change: 22 },
        ],
        conclusion:
            "Overall, Q4 2024 reflects a strong financial position with consistent revenue growth, improved profitability, and efficient cost management. The company is well-positioned for sustainable growth in the next quarter.",
        sourceFileName: "Q4 Financial Report 2024.pdf",
    },
    email: {
        to: "sarah@creativeminds.com",
        subject: "Project Update – Website Redesign Proposal",
        body: `Hi Sarah,

I hope you're doing well.

I'm pleased to share the initial proposal for your Website Redesign Project. Based on our discussions, we've prepared a solution that focuses on improving your brand presence, user experience, and overall website performance.

Project Overview
Project: Website Redesign
Estimated Timeline: 8 Weeks
Estimated Budget: ₹3,50,000

Deliverables
UI/UX Design, Responsive Frontend Development, Backend Integration, Quality Assurance & Testing, Final Deployment, 30 Days of Post-Launch Support

The proposal also includes the project scope, milestones, estimated timeline, and pricing details for your review.

Please take a look and let us know if you have any questions or would like to schedule a meeting to discuss any adjustments to make sure it aligns with your expectations.

We look forward to working with you and bringing your vision to life.

Best regards,
Jacob Jones
Project Manager | ProManage AI
hello@promanage.ai | +91 98765 43210`,
    },
    report: {
        project: "Website Redesign",
        generatedOn: "May 20, 2024",
        status: "On Track",
        progressPercent: 68,
        startDate: "Apr 10, 2024",
        dueDate: "Jun 10, 2024",
        budget: 350000,
        spent: 185000,
        executiveSummary:
            "The Website Redesign project is progressing well and is currently on track to meet the planned objectives. The team has completed major design deliverables and is in the final stages of development.",
        taskCounts: { completed: 17, in_progress: 6, pending: 2, overdue: 0 },
        keyHighlights: [
            "UI/UX design completed successfully.",
            "Frontend development is 70% complete.",
            "Backend integration in progress.",
            "Client feedback received and incorporated.",
        ],
    },
    invoice: {
        number: "INV-2025-00149",
        client: "Creative Minds Co.",
        dueDate: "20 Jun 2025",
        taxRate: 18,
        items: [
            { name: "UI/UX Design", qty: 1, rate: 60000 },
            { name: "Frontend Development", qty: 1, rate: 120000 },
            { name: "Backend Development", qty: 1, rate: 50000 },
        ],
    },
    meeting_notes: {
        title: "Project Discussion with Creative Minds Co.",
        date: "May 20, 2024",
        time: "10:00 AM - 11:00 AM",
        attendees: ["Jacob Jones", "Sarah Thompson", "Michael Brown"],
        overview: "The meeting was held to discuss the Website Redesign project scope, timeline, and next steps.",
        keyPoints: [
            "Reviewed the project objectives and expected outcomes.",
            "Discussed the design direction and reference materials.",
            "Agreed on the project timeline and key milestones.",
            "Clarified the scope of work and deliverables.",
            "Discussed integration requirements and third-party tools.",
        ],
        decisions: [
            "Approved the proposed timeline of 8 weeks.",
            "Confirmed the budget of ₹3,50,000.",
            "Finalized 4 major milestones.",
            "Agreed to proceed with the proposal.",
        ],
        actionItems: [
            { task: "Share final proposal document", owner: "Jacob Jones", dueDate: "May 21, 2024" },
            { task: "Provide content and brand assets", owner: "Sarah Thompson", dueDate: "May 24, 2024" },
            { task: "Review and confirm design direction", owner: "Sarah Thompson", dueDate: "May 24, 2024" },
            { task: "Setup project in ProManage AI", owner: "Michael Brown", dueDate: "May 21, 2024" },
        ],
        nextMeeting: { date: "May 27, 2024 (Monday)", time: "11:00 AM", location: "Google Meet" },
    },
};

export const mockPromptByAction = {
    proposal: "Generate a proposal for website redesign project for Creative Minds Co.",
    summarize: "Please summarize this document.",
    email: "Write a professional email to the client sharing the website redesign proposal.",
    report: "Generate a project report for Website Redesign.",
    invoice: "Create an invoice for Creative Minds Co. based on the current proposal.",
    meeting_notes: "Create meeting notes for the project discussion held today with Creative Minds Co.",
};

export const mockReplyByAction = {
    proposal: "Sure! I've created a proposal for your website redesign project.",
    summarize: "Here is the summary of your document Q4 Financial Report 2024.pdf",
    email: "Here's your email:",
    report: "Here's the project report for Website Redesign.",
    invoice: "Sure! I've generated the invoice below.",
    meeting_notes: "Sure! Here are the meeting notes from today's discussion.",
};