import React, { useState } from "react";
import { updateTenant } from "@/apiCalls/tenant/tenantApis";
import { Switch } from "rizzui";
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
        <Switch
            checked={isActive}
            onChange={handleToggle}
            label={isActive ? "Active" : "Inactive"}
            labelPlacement="left"
            size="md"
            labelClassName={isActive ? "text-green" : "text-red"}
            className="custon-switch"
        />
    );
}
