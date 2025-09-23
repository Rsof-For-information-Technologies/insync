export interface UpdateChatbotRequest {
    id: string;
    name: string;
    keywords: string[];
    isActive: boolean
}

export interface UpdateChatbotResponse {
    succeeded: boolean;
    message: "Chatbot Updated Successfully";
    data: {
        organizationID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        tenantID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: string,
        keywords: string[],
        isActive: boolean;
        createdAt: string;
        createdBy: string;
        updatedAt: string | null;
        updatedBy: string;
        isDeleted: boolean;
        deletedAt: string | null;
        deletedBy: string;
        id: string
    }
}