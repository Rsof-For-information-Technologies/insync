import { updateTenant } from "@/apiCalls/tenant/tenantApis";
import { ShadCnSwitch } from "@/components/shadCn/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export function TenantSwitch({ row }: { row: { id: string; isActive: boolean } }) {
    const [isActive, setIsActive] = useState(row.isActive);

    const handleToggle = async () => {
        const newValue = !isActive;
        setIsActive(newValue);

        try {
            const response = await updateTenant({ id: row.id, isActive: newValue });
            if (response.success) {
                toast.success(response.message || "Tenant updated");
            } else {
                toast.error(response.message || "Update failed");
                setIsActive(!newValue);
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Update failed");
            setIsActive(!newValue);
        }
    };

    return (
        <ShadCnSwitch
            checked={isActive}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-200"
        />
    );
}
