"use client";

import { useState } from "react";
import { Handle, Position } from "@xyflow/react";

interface TextNodeProps {
  id: string;
  data: { label: string; onChange: (val: string) => void; onDelete: (id: string) => void };
}

export default function TextNode({ id, data }: TextNodeProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(data.label);

  const handleBlur = () => {
    setEditing(false);
    data.onChange(text);
  };

  return (
    <div
      style={{
        border: "1px solid #999",
        borderRadius: "6px",
        padding: "4px",
        fontSize: "14px",
        minWidth: "100px",
        textAlign: "center",
        background: "#fff",
        position: "relative",
      }}
      onDoubleClick={() => setEditing(true)}
    >
      {/* Delete button */}
      <button
        onClick={() => data.onDelete(id)}
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        ×
      </button>

      {editing ? (
        <input
          value={text}
          autoFocus
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "14px",
            textAlign: "center",
          }}
        />
      ) : (
        <span>{text}</span>
      )}

      {/* Connection handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
