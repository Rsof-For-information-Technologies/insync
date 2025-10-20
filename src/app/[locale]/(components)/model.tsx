'use client';

import { Dialog, DialogContent } from "@/components/shadCn/ui/dialog";
import { Text } from "rizzui";

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

export function MessageModal({ isOpen, onClose, message }: MessageModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <div className="p-6">
                    <Text className="text-center text-lg mb-4">{message}</Text>
                    <button
                        onClick={onClose}
                        className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}