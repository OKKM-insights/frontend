export interface Project {
    id: string;
    title: string;
    description: string;
    status: "new" | "current" | "inprogress" | "live" | "finished";
    progress?: number;
    type: "label" | "client"
}
interface Category {
    name: string;
    value: number;
}
export interface DataInsightsProps {
    categoryData: Array<Category>;
}
export interface HeaderProps {
  status: "not_logged_in" | "logged_in";
}
export interface ProgressDataProps {
    completionPercentage: number;
    labeledPhotos: number;
    totalPhotos: number;
    timeRemaining: string;
}
export interface ProjectSectionProps {
  title: string;
  projects: Project[];
  color: string;
}
export interface ProjectTileProps {
  project: Project;
}
export interface QualityDataProps {
    accuracyRate: number;
    disputedLabels: number;
    reviewProgress: number;
}
interface Person {
    name: string;
    contribution: number;
    accuracy: number;
}
export interface WorkPerformanceProps {
    avgLabelSpeed: number;
    totalLabelers: number;
    topPerformers: Array<Person>;
}
export interface Labeller {
  id: number;
  email: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  skills: string;
  availability: number;
  userType: "labeller";
}
export interface Client {
  id: number;
  email: string;
  profilePicture: string;
  name: string;
  industry: string;
  typicalProj: string;
  userType: "client";
}
export type BoundingBox = {
  tlx: number;
  tly: number;
  brx: number;
  bry: number;
  w: number;
  h: number;
  label: string;
};

export type Image = {
  id: number;
  image: string;
  image_height: number;
  image_width: number;
  orig_image_id: number;
  project_id: number;
  x_offset: number;
  y_offset: number;
}
