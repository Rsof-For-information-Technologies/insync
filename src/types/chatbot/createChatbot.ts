export interface CreateChatbotRequest {
    organizationID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    tenantID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: string,
    keywords: string[]
}

export interface CreateChatbotResponse {
    succeeded: true,
    message: "Chatbot Created Successfully",
    data: {
        organizationID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        tenantID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: string,
        keywords: string[],
        isActive: true,
        createdAt: "2025-09-17T15:09:19.6561436+00:00",
        createdBy: "",
        updatedAt: null,
        updatedBy: "",
        isDeleted: false,
        deletedAt: null,
        deletedBy: "",
        id: "2b84a083-5aa8-4a94-cbc6-08ddf5fbb367"
    }
}