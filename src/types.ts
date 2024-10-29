export interface Project {
    id: string;
    title: string;
    description: string;
    status: "new" | "current" | "inprogress" | "live" | "finished";
    progress?: number;
}