export interface UpdateChatbotRequest {
    id: string;
    name: string;
    keywords: string[];
    isActive: boolean
}

export interface UpdateChatbotResponse {
    succeeded: boolean;
    message: string;
    data: {
        organizationID: string;
        tenantID: string;
        name: string;
        keywords: string[];
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