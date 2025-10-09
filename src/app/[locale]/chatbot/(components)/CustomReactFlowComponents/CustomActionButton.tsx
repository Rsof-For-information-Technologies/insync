"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/shadCn/ui/tooltip";
import { ReactNode } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface CustomActionButtonProps {
    icon: ReactNode;
    title: string;
    ariaLabel: string;
    onClick?: () => void;
    hoverColor?: string;
    tooltip?: string;
    tooltipPosition?: TooltipPosition;
    className?: string;
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
}

export default function CustomActionButton({
    icon,
    title,
    ariaLabel,
    onClick,
    hoverColor = "hover:bg-gray-800",
    tooltip,
    tooltipPosition = "right",
    className = "",
    draggable = false,
    onDragStart,
}: CustomActionButtonProps) {
    const button = (
        <button
            onClick={onClick}
            title={title}
            aria-label={ariaLabel}
            draggable={draggable}
            onDragStart={onDragStart}
            className={`p-3 rounded-full bg-gray-100 ${hoverColor} hover:text-white transition ${className}`}
        >
            {icon}
        </button>
    );

    if (!tooltip) {
        return button;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side={tooltipPosition}>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
}
