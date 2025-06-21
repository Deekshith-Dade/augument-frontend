export interface ChatSession {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface ThoughtList {
    id: string;
    title: string;
    excerpt: string;
    created_at: string;
    position: number[];
    label: number;
}
