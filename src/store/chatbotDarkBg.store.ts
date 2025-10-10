import { create } from "zustand";

interface ChatbotDarkBgStore {
    isDarkBg: boolean;
    toggleMode: () => void;
}

const useChatbotDarkBgStore = create<ChatbotDarkBgStore>((set) => ({
    isDarkBg: false,
    toggleMode: () => set((state) => ({ isDarkBg: !state.isDarkBg })),
}));

export default useChatbotDarkBgStore;