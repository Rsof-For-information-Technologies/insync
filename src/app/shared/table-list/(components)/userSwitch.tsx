import { updateUser } from "@/apiCalls/user/userApis";
import { ShadCnSwitch } from "@/components/shadCn/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export function UserSwitch({ row, field }: { row: any; field: "isActive" | "isInvitationSent" | "isInvitationAccept" }) {
  const [checked, setChecked] = useState(row[field]);

  const handleToggle = async () => {
    const newValue = !checked;
    setChecked(newValue);

    try {
      const res = await updateUser({
        id: row.id,
        isActive: field === "isActive" ? newValue : row.isActive,
        isInvitationSent: field === "isInvitationSent" ? newValue : row.isInvitationSent,
        isInvitationAccept: field === "isInvitationAccept" ? newValue : row.isInvitationAccept,
      });
      if (res.success) {
        toast.success(res.message || `${field} updated`);
      } else {
        toast.error(res.message || "Update failed");
        setChecked(!newValue);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
      setChecked(!newValue);
    }
  };

  return (
    <ShadCnSwitch
      checked={checked}
      onCheckedChange={handleToggle}
      className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-200"
      // label={
      //   field === "isActive"
      //     ? checked ? "Active" : "Inactive"
      //     : field === "isInvitationSent"
      //     ? checked ? "Invitation Sent" : "Not Sent"
      //     : checked ? "Accepted" : "Not Accepted"
      // }
      // labelPlacement="left"
      // labelClassName={checked ? "text-green" : "text-red"}
    />
  );
}

