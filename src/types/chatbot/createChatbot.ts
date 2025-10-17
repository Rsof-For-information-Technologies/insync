export interface CreateChatbotRequest {
    organizationID: string,
    tenantID: string,
    name: string,
    keywords: string[]
}

export interface CreateChatbotResponse {
    succeeded: true,
    message: string,
    data: {
        organizationID: string,
        tenantID: string,
        name: string,
        keywords: string[],
        isActive: true,
        createdAt: string,
        createdBy: string,
        updatedAt: null,
        updatedBy: string,
        isDeleted: false,
        deletedAt: null,
        deletedBy: string,
        id: string
    }
}