"use client";

import { Lock, Maximize, Minus, Plus } from "lucide-react";
import { forwardRef } from "react";

import {
    Panel,
    useReactFlow,
    useStore,
    useViewport,

    type PanelProps,
} from "@xyflow/react";

import cn from "@/utils/class-names";
import { ShadCnButton } from "../button";
import { Slider } from "../slider";

export const ZoomSlider = forwardRef<
    HTMLDivElement,
    Omit<PanelProps, "children">
>(({ className, ...props }, ref) => {
    const { zoom } = useViewport();
    const { zoomTo, zoomIn, zoomOut, fitView } = useReactFlow();
    const minZoom = useStore((state) => state.minZoom);
    const maxZoom = useStore((state) => state.maxZoom);

    return (
        <Panel
            className={cn(
                "flex gap-1 rounded-md bg-primary-foreground p-1 text-foreground",
                className,
            )}
            ref={ref}
            {...props}
        >
            <ShadCnButton
                variant="ghost"
                size="icon"
                onClick={() => zoomOut({ duration: 300 })}
            >
                <Minus className="h-4 w-4" />
            </ShadCnButton>
            <Slider
                className="w-[140px]"
                value={[zoom]}
                min={minZoom}
                max={maxZoom}
                step={0.01}
                onValueChange={(values) => zoomTo(values[0])}
            />
            <ShadCnButton
                variant="ghost"
                size="icon"
                onClick={() => zoomIn({ duration: 300 })}
            >
                <Plus className="h-4 w-4" />
            </ShadCnButton>
            <ShadCnButton
                className="min-w-20 tabular-nums"
                variant="ghost"
                onClick={() => zoomTo(1, { duration: 300 })}
            >
                {(100 * zoom).toFixed(0)}%
            </ShadCnButton>
            <ShadCnButton
                variant="ghost"
                size="icon"
                onClick={() => fitView({ duration: 300 })}
            >
                <Maximize className="h-4 w-4" />
            </ShadCnButton>
        </Panel>
    );
});

ZoomSlider.displayName = "ZoomSlider";