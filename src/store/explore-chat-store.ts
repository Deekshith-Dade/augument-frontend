import { create } from "zustand";
import { ChatSession } from "@/lib/types";



interface ExploreChatStore {
    sessions: ChatSession[];
    setSessions: (sessions: ChatSession[]) => void;
    activeSessionId: string | null;
    setActiveSessionId: (sessionId: string | null) => void;
    setNewSession: () => void;
    addSession: (session: ChatSession) => void;
    currentThoughtId: string | null;
    setCurrentThoughtId: (thoughtId: string | null) => void;
}

const useExploreChatStore = create<ExploreChatStore>((set) => ({
    sessions: [],
    setSessions: (sessions: ChatSession[]) => set({ sessions }),
    activeSessionId: null,
    setActiveSessionId: (sessionId: string | null) => set({ activeSessionId: sessionId }),
    setNewSession: () => set({activeSessionId: null}),
    addSession: (session: ChatSession) => set((state) => {
        const sessionExists = state.sessions.some(s => s.id === session.id);
        if (sessionExists) return state;
        return { sessions: [...state.sessions, session] };
    }),
        
    currentThoughtId: null,
    setCurrentThoughtId: (thoughtId: string | null) => set({ currentThoughtId: thoughtId }),
}))

export default useExploreChatStore;