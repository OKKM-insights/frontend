import React from 'react';
import { Project } from '@/types';

interface ProjectTileProps {
  project: Project;
}

const ProjectTile: React.FC<ProjectTileProps> = ({ project }) => {
  return (
    <div className="w-80 bg-gray-800 text-white border border-white p-4 rounded-lg flex-shrink-0">
      <div className="mb-12">
        <h5 className="text-xl font-bold truncate">{project.title}</h5>
        <p className="text-gray-400 text-sm overflow-hidden">{project.description}</p>
      </div>
      <div className="mt-4">
        {(project.status === 'current' || project.status === 'inprogress') && project.progress !== undefined && (
          <div className="mb-4">
            <div className="bg-gray-600 h-2 rounded-md">
              <div
                className="bg-green-500 h-2 rounded-md"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">{project.progress}% Complete</p>
          </div>
        )}
        <button
          className={`w-full p-3 rounded-md text-white ${
            project.status === 'new'
              ? 'bg-blue-600 hover:bg-blue-700'
              : project.status === 'live'
              ? 'bg-blue-600 hover:bg-blue-700'
              : project.status === 'inprogress' || project.status === 'current'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          {project.status === 'new'
            ? 'Create Project'
            : project.status === 'inprogress'
            ? 'Continue'
            : project.status === 'live'
            ? 'Start Labeling'
            : project.status === 'current'
            ? 'View Progress'
            : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default ProjectTile;