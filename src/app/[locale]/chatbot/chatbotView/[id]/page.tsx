"use client";

import { ReactFlowProvider } from "@xyflow/react";
import ChatbotMain from "../../(components)/chatbotMain"
import { useParams } from "next/navigation";

export default function FlowWrapper() {
    const params = useParams();
  const id = params.id;
  console.log(id)
  return (
    <ReactFlowProvider>
      <ChatbotMain />
    </ReactFlowProvider>
  );
}
