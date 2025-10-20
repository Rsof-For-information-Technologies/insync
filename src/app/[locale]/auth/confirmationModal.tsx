import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadCn/ui/dialog";
import Image from "next/image";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

export function ConfirmationModal({ isOpen, onClose, message }: ModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="d-flex justify-center items-center">
                    <Image
                        src={"/insync-short-logo-01.png"}
                        alt="Sign Up Thumbnail"
                        width={50}
                        height={50}
                        priority
                        className="object-cover"
                    />
                    <DialogTitle className="my-4">Notification</DialogTitle>
                    <DialogDescription className="mb-4 text-green-500">
                        {message}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
