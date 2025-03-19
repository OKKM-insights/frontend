import React, { useRef } from "react";
import ProjectTile from "./ProjectTile";
import { ProjectSectionProps } from "@/types";

const ProjectSection: React.FC<ProjectSectionProps> = ({triggerReload, title, projects, color }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold" style={{ color: color }}>{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 w-10 hover:bg-gray-600">
            {"<"}
          </button>
          <button onClick={() => scroll("right")} className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 w-10 hover:bg-gray-600">
            {">"}
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
      >
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectTile triggerReload={triggerReload} key={project.id} project={project} />
          ))
        ) : (
          <p className="text-gray-400 text-xl text-center w-full my-5">
            {title === "Live Projects" 
              ? "No Live Projects" 
              : title === "Current Projects"
              ? "No Current Projects"
              : title === "Finished Projects"
              ? "No Finished Projects"
              : ""
            }
          </p>
        )}
      </div>
    </section>
  );
};

export default ProjectSection;