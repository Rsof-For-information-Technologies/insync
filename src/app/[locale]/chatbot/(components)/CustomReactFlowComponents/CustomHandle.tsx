import { Handle, HandleProps, useNodeConnections } from "@xyflow/react";

interface CustomHandleProps extends HandleProps {
    connectionCount: number;
}

export default function CustomHandle(props: CustomHandleProps) {
    const connections = useNodeConnections({
        handleType: props.type,
    });

    return (
        <Handle
            style={{
                width: 8,
                height: 8,
                background: "white",
                border: "2px solid black",
            }}
            {...props}
            isConnectable={connections.length < props.connectionCount}
        />
    );
}
