export { }
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_TENANT_URL: string;
            TENANT_BASE_URL: string;

            NEXT_PUBLIC_CONNECT_URL: string;
            CONNECT_BASE_URL: string;

            NEXT_PUBLIC_CHANNELHUB_BASE_URL: string;
            CHANNEL_BASE_URL: string;

            NEXT_PUBLIC_ENCRYPTION_KEY: string;
            SECRET_KEY: string;
            NEXT_PUBLIC_FRONTEND_URL: string;
        }
    }

}
