import { getAllProjects } from "@/apiCalls/projects/userApis";
import { getProjectColumns } from "@/app/shared/table-list/projectColumns";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import { GetAllProjectsResponse } from "@/types/project/getAllProjects";
import { UserRole } from "@/types/userRoles";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../(components)/CommonHeader";

export const metadata: Metadata = {
  title: "Project Management",
};

export default async function ProjectTablePage({ params }: { params: Params }) {
  const t = await getTranslations('ProjectPages.projectListPage')
  const { data: projectsData }: GetAllProjectsResponse = await getAllProjects();
  const { locale } = params;
  const columns = getProjectColumns

  return (
    <Authenticate >
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col space-y-6">
          <Header
            title={t('title')}
            description={t('description')}
            icon={<Plus size={18} />}
            btnText={t('navigateCreateProject.createProjectBtn')}
            href={`/${locale}${routes.project.create}`}
          />
          {/* Table Widget */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <BasicTableWidget
              title={t('projectTable.title')}
              variant="minimal"
              data={projectsData ? projectsData : []}
              getColumns={columns}
              enablePagination
              searchPlaceholder={t('projectTable.searchPlaceholder')}
              className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
            />
          </div>
        </div>
      </Authorize>
    </Authenticate>
  );
}
