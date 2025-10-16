export interface Chatbot {
    id: number,
    organizationID: string,
    name: string,
    isActive: boolean
    rowVersion: string;
    domainEvents: string[];
}


export type GetAllChatbotResponse = {
    data: Chatbot[];
    success: boolean;
    statusCode: "OK" | "Created" | "BadRequest" | "Unauthorized" | "Forbidden" | "NotFound" | "Conflict" | "InternalServerError";
    message: string;
    successes: string[];
    errors: string[];
    validationErrors: string[];
};