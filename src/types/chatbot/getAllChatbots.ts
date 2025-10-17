import { ApiBaseResponse } from "..";

export interface Chatbot {
    id: number,
    organizationID: string,
    name: string,
    isActive: boolean
    rowVersion: string;
    domainEvents: string[];
}

export type GetAllChatbotResponse = ApiBaseResponse<Chatbot[]>;

// statusCode: "OK" | "Created" | "BadRequest" | "Unauthorized" | "Forbidden" | "NotFound" | "Conflict" | "InternalServerError";