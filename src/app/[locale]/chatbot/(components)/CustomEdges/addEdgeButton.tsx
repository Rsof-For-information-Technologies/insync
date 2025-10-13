import { Menu, Dropdown } from "antd";

interface EdgeAddButtonProps {
    id: string;
    data?: { onAddNodeCallback?: (params: { id: string; type: string }) => void };
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

    const menu = (
        <Menu
            onClick={(event) =>
                data?.onAddNodeCallback &&
                data.onAddNodeCallback({ id, type: event.key as string })
            }
        >
            {nodeOptions.map((option) => (
                <Menu.Item key={option.value}>{option.label}</Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={["click"]} placement="bottom">
            <div className="flex items-center justify-center">
                <button
                    className="w-[24px] h-[24px] p-0 text-[14px] border border-black text-black flex items-baseline justify-center rounded-full bg-white hover:bg-gray-100 transition cursor-pointer"
                >
                    +
                </button>
            </div>
        </Dropdown>
    );
}
