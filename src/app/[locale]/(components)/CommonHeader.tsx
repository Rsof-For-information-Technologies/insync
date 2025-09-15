"use client";
import { Button } from "rizzui";
import Link from "next/link";

interface HeaderProps {
    title: string;
    description?: string;
    btnText?: string;
    icon?: React.ReactNode;
    href?: string;
}

export default function Header({ title, description, btnText, icon, href }: HeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gray-50 dark:bg-gray-100 rounded-xl shadow-sm">

            {/* Title + Description */}
            <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    {title}
                </h1>
                {description && (
                    <p className="text-gray-600 mt-2 dark:text-gray-500">
                        {description}
                    </p>
                )}
            </div>

            {/* Button */}
            {href && btnText && (
                <div>
                    <Link href={href}>
                        <Button
                            variant="solid"
                            color="primary"
                            className="flex items-center gap-2 px-4 py-2.5"
                        >
                            {icon && icon}
                            {btnText}
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
