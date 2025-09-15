import { Plus } from "lucide-react";
import { Button } from "rizzui";

interface HeaderProps {
    title: string;
    description?: string;
    btn?: () => void;
    btnText?: string;
    icon?: React.ReactNode;
}

export default function Header({ title, description, btn, btnText, icon }: HeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gray-50 dark:bg-gray-100 rounded-xl shadow-sm">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
                {description ? (
                    <p className="text-gray-600 mt-2 dark:text-gray-500">{description}</p>
                ) : null}
            </div>
            <Button
                variant="solid"
                color="primary"
                className="flex items-center gap-2 px-4 py-2.5"
                onClick={btn}
            >
                {icon ? icon : null}
                {btnText}
            </Button>
        </div>
    );
}
