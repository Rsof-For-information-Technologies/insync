export interface Chatbot {
    createdAt: string;
    createdBy: string;
    updatedAt: string | null;
    updatedBy: string;
    isDeleted: boolean;
    deletedAt: string | null;
    deletedBy: string;
    id: number,
    organizationID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    tenantID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: string,
    keywords: string[],
    isActive: boolean
}


export type GetAllChatbot = Chatbot[];