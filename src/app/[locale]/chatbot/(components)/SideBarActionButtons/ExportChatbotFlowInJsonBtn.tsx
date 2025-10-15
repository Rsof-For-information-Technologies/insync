import { useReactFlow } from '@xyflow/react';
import { useParams, useSearchParams } from 'next/navigation';
import { PiExport } from 'react-icons/pi';
import CustomActionButton from '../CustomReactFlowComponents/CustomActionButton';

function ExportChatbotFlowInJsonBtn() {
    const { getNodes, getEdges } = useReactFlow();
    const { id: flowId } = useParams<{ id: string }>();
    const searchParams = useSearchParams()
    const chatbotName = searchParams.get('name')

    const exportFlow = () => {
        const nodes = getNodes();
        const edges = getEdges();

        const name = chatbotName || `chatbot-flow-name-${new Date().toISOString().split('T')[0]}`;

        const fullFlow = {
            flowId,
            flowName: name,
            version: "1.0.0",
            metadata: {
                createdAt: new Date().toISOString(),
                exportedAt: new Date().toISOString(),
                nodeCount: nodes.length,
                edgeCount: edges.length,
            },
            nodes: nodes,
            edges: edges,
        };

        const jsonString = JSON.stringify(fullFlow, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <CustomActionButton
            icon={<PiExport size={20} />}
            title="Export Chatbot Flow as JSON"
            ariaLabel="Export Chatbot Flow as JSON"
            onClick={exportFlow}
            tooltip="Export the current chatbot flow as a JSON file"
            tooltipPosition="right"
            hoverColor="hover:bg-gray-800"
        />
    )
}

export default ExportChatbotFlowInJsonBtn