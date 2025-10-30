import { getProjectById } from "@/apiCalls/projects/userApis";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { GetProjectByIdResponse } from "@/types/project/getProjectById";
import { UserRole } from "@/types/userRoles";
import { Hash } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { MdOutlineDescription } from "react-icons/md";
import { BiRename } from "react-icons/bi";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import Header from "../../(components)/CommonHeader";

export default async function DetailsProject({ params }: { params: { projectId: string } }) {
  const t = await getTranslations("ProjectPages.projectDetailPage");
  const { projectId } = params;
  const { data: project }: GetProjectByIdResponse = await getProjectById({ id: projectId });

  return (
    <Authenticate>
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <Header title={t("title")} description={t("description")} />

          <CollapsibleSection title={t("projectDetails.title")} defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <BiRename size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h6 className="font-semibold text-gray-800 dark:text-white"> {t("projectDetails.name")} </h6>
                </div>
                <p className="text-lg font-mono text-gray-700 dark:text-gray-600 pl-11">{project.name}</p>
              </div>

              <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                    <MdOutlineDescription size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h6 className="font-semibold text-gray-800 dark:text-white"> {t("projectDetails.description")} </h6>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-600 pl-11">{project.description}</p>
              </div>
              <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-700 rounded-lg">
                    <Hash size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h6 className="font-semibold text-gray-800 dark:text-white"> {t("projectDetails.id")} </h6>
                </div>
                <p className="text-lg font-mono text-gray-700 dark:text-gray-600 pl-11">{project.id}</p>
              </div>

              <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-700 rounded-lg">
                    <Hash size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h6 className="font-semibold text-gray-800 dark:text-white"> {t("projectDetails.organizationId")} </h6>
                </div>
                <p className="text-lg font-mono text-gray-700 dark:text-gray-600 pl-11"> {project.organizationId} </p>
              </div>

              <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <div
                      className={`w-3 h-3 rounded-full ${project.isActive ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                  </div>
                  <h6 className="font-semibold text-gray-800 dark:text-white"> {t("projectDetails.status")} </h6>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${project.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    } pl-11`}
                >
                  {project.isActive ? t("projectDetails.active") : t("projectDetails.inactive")}
                </span>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </Authorize>
    </Authenticate>
  );
}
