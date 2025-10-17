export interface ApiBaseResponse<TData = unknown> {
  data: TData;
  success: boolean;
  statusCode: string;
  message: string;
  successes: string[];
  errors: any[];
  validationErrors: Record<string, any>;
}