import { updateTenant } from "@/apiCalls/tenant/tenantApis";
import { ShadCnSwitch } from "@/components/shadCn/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export function TenantSwitch({ row }: { row: any }) {
    const [isActive, setIsActive] = useState(row.isActive);

    const handleToggle = async () => {
        const newValue = !isActive;
        setIsActive(newValue);

        try {
            const res = await updateTenant({ id: row.id, isActive: newValue });
            if (res.succeeded) {
                toast.success(res.message || "Tenant updated");
            } else {
                toast.error(res.message || "Update failed");
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
