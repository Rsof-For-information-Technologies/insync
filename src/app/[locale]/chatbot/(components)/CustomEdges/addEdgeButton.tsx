"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadCn/ui/popover";
import { useState } from "react";

interface EdgeAddButtonProps {
  id: string;
  data?: {
    onAddNodeCallback?: (params: {
      id: string;
      type: string;
      isHandle?: boolean;
      nodeId?: string;
      handleType?: "source" | "target";
    }) => void;
    isHandle?: boolean;
    nodeId?: string;
    handleType?: "source" | "target";
  };
}

export default function EdgeAddButton({ id, data }: EdgeAddButtonProps) {
  const nodeOptions = [
    { label: "Text Node", value: "textNode" },
    { label: "Image Node", value: "imageNode" },
    { label: "Video Node", value: "videoNode" },
    { label: "Document Node", value: "documentNode" },
    { label: "Audio Node", value: "audioNode" },
    { label: "Button Node", value: "buttonNode" },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    data?.onAddNodeCallback?.({
      id,
      type: key,
      isHandle: data.isHandle,
      nodeId: data.nodeId,
      handleType: data.handleType,
    });
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {nodeOptions.map(({ value, label }) => (
        <Menu.Item key={value}>{label}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottom">
      <button
        className="flex items-center justify-center w-6 h-6 text-sm border border-black text-black rounded-full bg-white hover:bg-gray-100 transition"
        title="Add Node"
      >
        +
      </button>
    </Dropdown>
  );
}
