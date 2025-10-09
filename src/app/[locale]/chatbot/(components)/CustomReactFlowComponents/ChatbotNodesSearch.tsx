import { NodeSearch } from '@/components/shadCn/ui/NodeSearch'
import { Panel } from '@xyflow/react'

function ChatbotNodesSearch() {
    return (
        <Panel
            className="flex gap-1 rounded-md bg-primary-foreground p-1 text-foreground"
            position="top-center"
        >
            <NodeSearch />
        </Panel>
    )
}

export default ChatbotNodesSearch