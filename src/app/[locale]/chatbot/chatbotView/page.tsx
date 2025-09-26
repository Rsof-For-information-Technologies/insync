"use client";

import { ReactFlowProvider } from "@xyflow/react";
import ChatbotMain from "../(components)/chatbotMain"

export default function FlowWrapper() {
  return (
    <ReactFlowProvider>
      <ChatbotMain />
    </ReactFlowProvider>
  );
}
