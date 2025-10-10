import { Panel, useReactFlow, useStoreApi } from '@xyflow/react';
import { FocusIcon } from 'lucide-react';
import CustomActionButton from '../CustomReactFlowComponents/CustomActionButton';

const panelStyle = {
    color: '#777',
    fontSize: 12,
};

const buttonStyle = {
    fontSize: 12,
    marginRight: 5,
    marginTop: 5,
};

const FocusToStartNode = () => {
    const store = useStoreApi();
    const { setCenter } = useReactFlow();

    const focusNode = () => {
        const { nodeLookup } = store.getState();
        const nodes = Array.from(nodeLookup).map(([, node]) => node);

        if (nodes.length > 0) {
            const node = nodes[0];

            if (node.measured?.width && node.measured?.height) {
                const x = node.position.x + node.measured.width / 2;
                const y = node.position.y + node.measured.height / 2;
                const zoom = 1.85;

                setCenter(x, y, { zoom, duration: 1000 });
            }
        }
    };

    return (
        <Panel position="bottom-center" style={panelStyle}>
            <CustomActionButton
                icon={<FocusIcon size={20} />}
                title="Focus on Start Node"
                ariaLabel="Focus on Start Node"
                onClick={focusNode}
                tooltip="Focus on the start node"
                tooltipPosition="top"
                hoverColor="hover:bg-gray-800"
            />
        </Panel>
    );
};

export default FocusToStartNode;
