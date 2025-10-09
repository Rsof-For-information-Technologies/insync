import { getUserById } from "@/apiCalls/user/userApis";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserByIdResponse } from "@/types/user/getUserById";
import { UserRole } from "@/types/userRoles";
import { Building, Calendar, CheckCircle, Clock, Hash, Mail, RefreshCw, Send, XCircle, } from "lucide-react";
import { getTranslations } from "next-intl/server";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import Header from "../../(components)/CommonHeader";

export default async function DetailsUser({ params }: { params: { userId: string } }) {
  const t = await getTranslations("UserPages.userDetailPage");
  const { userId } = params;
  const user: UserByIdResponse = await getUserById(userId);

  return (
    // <Authenticate>
    //   <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
    <div className="flex flex-col space-y-6">
      {/* Header Section */}
      <Header title={t("title")} description={t("description")} />

      <CollapsibleSection title={t("userDetails.title")} defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Hash size={20} className="text-gray-600 dark:text-gray-300" />
              </div>
              <h6 className="font-semibold text-gray-800 dark:text-white">
                {t("userDetails.id")}
              </h6>
            </div>
            <p className="text-lg font-mono text-gray-700 dark:text-gray-600 pl-11">{user.id}</p>
          </div>

          <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Building size={20} className="text-gray-600 dark:text-gray-300" />
              </div>
              <h6 className="font-semibold text-gray-800 dark:text-white">
                {t("userDetails.tenantId")}
              </h6>
            </div>
            <p className="text-lg font-mono text-gray-700 dark:text-gray-600 pl-11">
              {user.tenantId}
            </p>
          </div>

          <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Building size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h6 className="font-semibold text-gray-800 dark:text-white">
                {t("userDetails.organizationId")}
              </h6>
            </div>
            <p className="text-lg font-mono text-gray-700 dark:text-gray-600 pl-11">
              {user.organizationId}
            </p>
          </div>

          <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Hash size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h6 className="font-semibold text-gray-800 dark:text-white">
                {t("userDetails.userId")}
              </h6>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-600 pl-11">{user.userId}</p>
          </div>

          <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                <Mail size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h6 className="font-semibold text-gray-800 dark:text-white">
                {t("userDetails.email")}
              </h6>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-600 pl-11">{user.email || "-"}</p>
          </div>

          <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${user.isInvitationAccept
                    ? "bg-green-100 dark:bg-green-900/40"
                    : "bg-red-100 dark:bg-red-900/40"
                  }`}
              >
                {user.isInvitationAccept ? (
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle size={20} className="text-red-600 dark:text-red-400" />
                )}
              </div>
              <h6 className="font-semibold text-gray-800 dark:text-white">
                {t("userDetails.isInvitationAccept")}
              </h6>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit pl-11 ${user.isInvitationAccept
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
            >
              {user.isInvitationAccept ? t("userDetails.yes") : t("userDetails.no")}
            </span>
          </div>

          <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg">
                <Send size={20} className="text-teal-600 dark:text-teal-400" />
              </div>
              <h6 className="font-semibold text-gray-800 dark:text-white">
                {t("userDetails.isInvitationSent")}
              </h6>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit pl-11 ${user.isInvitationSent
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
            >
              {user.isInvitationSent ? t("userDetails.send") : t("userDetails.resend")}
            </span>
          </div>

          <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                <div
                  className={`w-3 h-3 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`}
                ></div>
              </div>
              <h6 className="font-semibold text-gray-800 dark:text-white">
                {t("userDetails.status")}
              </h6>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${user.isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                } pl-11`}
            >
              {user.isActive ? t("userDetails.active") : t("userDetails.inactive")}
            </span>
          </div>

          <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h6 className="font-semibold text-gray-800 dark:text-white">
                {t("userDetails.createdAt")}
              </h6>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-600 pl-11">
              <Calendar size={16} />
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              <Clock size={16} className="ml-2" />
              <span>{new Date(user.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <RefreshCw size={20} className="text-gray-600 dark:text-gray-300" />
              </div>
              <h6 className="font-semibold text-gray-800 dark:text-white">
                {t("userDetails.updatedAt")}
              </h6>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-600 pl-11">
              <Calendar size={16} />
              <span>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "-"}</span>
              <Clock size={16} className="ml-2" />
              <span>{user.updatedAt ? new Date(user.updatedAt).toLocaleTimeString() : "-"}</span>
            </div>
          </div>

          <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <XCircle size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <h6 className="font-semibold text-gray-800 dark:text-white">
                {t("userDetails.deletedAt")}
              </h6>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-600 pl-11">
              <Calendar size={16} />
              <span>{user.deletedAt ? new Date(user.deletedAt).toLocaleDateString() : "-"}</span>
              <Clock size={16} className="ml-2" />
              <span>{user.deletedAt ? new Date(user.deletedAt).toLocaleTimeString() : "-"}</span>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
    //   </Authorize>
    // </Authenticate>
  );
}
