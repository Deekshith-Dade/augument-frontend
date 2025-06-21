import { create } from "zustand";
// import { ChatSession } from "@/lib/types";



interface ExploreChatStore {
    activeSessionId: string | null;
    setActiveSessionId: (sessionId: string | null) => void;
    setNewSession: () => void;
    currentSessionName: string | null;
    setCurrentSessionName: (sessionName: string | null) => void;
    // addSession: (session: ChatSession) => void;
    currentThoughtId: string | null;
    setCurrentThoughtId: (thoughtId: string | null) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const useExploreChatStore = create<ExploreChatStore>((set) => ({
    activeSessionId: null,
    setActiveSessionId: (sessionId: string | null) => set({ activeSessionId: sessionId }),
    setNewSession: () => set({activeSessionId: null}),
    currentSessionName: null,
    setCurrentSessionName: (sessionName: string | null) => set({ currentSessionName: sessionName }),
    // addSession: (session: ChatSession) => set((state) => {
    //     const sessionExists = state.sessions.some(s => s.id === session.id);
    //     if (sessionExists) return state;
    //     return { sessions: [...state.sessions, session] };
    // }),
        
    currentThoughtId: null,
    setCurrentThoughtId: (thoughtId: string | null) => set({ currentThoughtId: thoughtId }),
    isSidebarOpen: false,
    setIsSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
}))

export default useExploreChatStore;