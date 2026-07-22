// src/components/AI/AIResultCard.jsx
import ProposalResultCard from "./cards/ProposalResultCard";
import SummaryResultCard from "./cards/SummaryResultCard";
import EmailResultCard from "./cards/EmailResultCard";
import ReportResultCard from "./cards/ReportResultCard";
import InvoiceResultCard from "./cards/InvoiceResultCard";
import MeetingNotesResultCard from "./cards/MeetingNotesResultCard";

// Single switch point: adding a 7th tool later means adding one entry here
// and one new card file, instead of a growing if/else in AIAssistant.jsx.
const CARD_COMPONENTS = {
    proposal: ProposalResultCard,
    summary: SummaryResultCard,
    email: EmailResultCard,
    report: ReportResultCard,
    invoice: InvoiceResultCard,
    meeting_notes: MeetingNotesResultCard,
};

export default function AIResultCard({ resultType, data, actions = {} }) {
    const Card = CARD_COMPONENTS[resultType];
    if (!Card) return null;
    return <Card data={data} {...actions} />;
}