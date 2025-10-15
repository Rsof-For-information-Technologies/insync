import { ReactFlowProvider } from "@xyflow/react";
import { Metadata } from "next";
import ChatbotMain from "../../(components)/chatbotMain";
import ChatbotFormProvider from "./ChatbotFormProvider";

export const metadata: Metadata = {
  title: "Chatbot Editor",
  description: "Create and manage chatbot flows with ease.",
}

export default function FlowWrapper() {

  return (
    <ReactFlowProvider>
      <ChatbotFormProvider>
        <ChatbotMain />
      </ChatbotFormProvider>
    </ReactFlowProvider>
  );
}
