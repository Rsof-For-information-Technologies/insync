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
  const [open, setOpen] = useState(false);

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-center">
          <button
            className="w-[24px] h-[24px] p-0 text-[14px] border border-black text-black flex items-baseline justify-center rounded-full bg-white hover:bg-gray-100 transition cursor-pointer"
          >
            +
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-white" align="center">
        <div className="flex flex-col gap-1">
          {nodeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleMenuClick({ key: option.value })}
              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}


// export default function EdgeAddButton({ id, data }: EdgeAddButtonProps) {
//   const nodeOptions = [
//     { label: "Text Node", value: "textNode" },
//     { label: "Image Node", value: "imageNode" },
//     { label: "Video Node", value: "videoNode" },
//     { label: "Document Node", value: "documentNode" },
//     { label: "Audio Node", value: "audioNode" },
//     { label: "Button Node", value: "buttonNode" },
//   ];

//   const handleMenuClick = ({ key }: { key: string }) => {
//     data?.onAddNodeCallback?.({
//       id,
//       type: key,
//       isHandle: data.isHandle,
//       nodeId: data.nodeId,
//       handleType: data.handleType,
//     });
//   };

//   const menu = (
//     <Menu onClick={handleMenuClick}>
//       {nodeOptions.map(({ value, label }) => (
//         <Menu.Item key={value}>{label}</Menu.Item>
//       ))}
//     </Menu>
//   );

//   return (
//     <Dropdown overlay={menu} trigger={["click"]} placement="bottom">
//       <button
//         className="flex items-center justify-center w-6 h-6 text-sm border border-black text-black rounded-full bg-white hover:bg-gray-100 transition"
//         title="Add Node"
//       >
//         +
//       </button>
//     </Dropdown>
//   );
// }
