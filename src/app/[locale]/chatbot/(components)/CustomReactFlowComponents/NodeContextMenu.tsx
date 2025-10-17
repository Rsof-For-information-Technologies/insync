import { useReactFlow } from '@xyflow/react';
import { Copy, Trash2 } from 'lucide-react';
import { useCallback } from 'react';

type NodeContextMenuProps = {
    id: string;
    top?: number | false;
    left?: number | false;
    right?: number | false;
    bottom?: number | false;
    onClick?: () => void;
}

export default function NodeContextMenu({
    id,
    top,
    left,
    right,
    bottom,
    ...props
}: NodeContextMenuProps) {
    const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
    
    const duplicateNode = useCallback(() => {
        const node = getNode(id);
        if (!node) return;
        
        const position = {
            x: node.position.x + 50,
            y: node.position.y + 50,
        };

        addNodes({
            ...node,
            selected: false,
            dragging: false,
            id: `${node.id}-${Date.now()}`,
            position,
        });
    }, [id, getNode, addNodes]);

    const deleteNode = useCallback(() => {
        const node = getNode(id);
        if (node && node.data && typeof node.data.onDelete === 'function') {
            // Use the node's onDelete function to ensure proper cleanup
            node.data.onDelete(id);
        } else {
            // Fallback to manual deletion
            setNodes((nodes) => nodes.filter((node) => node.id !== id));
            setEdges((edges) => edges.filter((edge) => edge.source !== id || edge.target !== id));
        }
    }, [id, getNode, setNodes, setEdges]);

    return (
        <div
            style={{ 
                top: top !== false ? top : undefined, 
                left: left !== false ? left : undefined, 
                right: right !== false ? right : undefined, 
                bottom: bottom !== false ? bottom : undefined 
            }}
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px]"
            {...props}
        >
            <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium">
                    Node Actions
                </p>
            </div>
            <button 
                onClick={duplicateNode}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
                <Copy size={16} />
                <span>Duplicate</span>
            </button>
            <button 
                onClick={deleteNode}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
                <Trash2 size={16} />
                <span>Delete</span>
            </button>
        </div>
    );
}
