import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ImageCarousel } from '../components/ui/ImageCarousel';
import { ProjectModal } from '../components/projects/ProjectModal';
import { useProjectStore } from '../store/projectStore';
import type { Project } from '../types';

export const Projects: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  const handleAddProject = () => {
    setEditingProject(undefined);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      deleteProject(id);
    }
  };

  const handleSubmit = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-600 mt-2">Gérez vos projets de construction</p>
        </div>
        <Button onClick={handleAddProject}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <ImageCarousel
              images={project.images}
              alt={project.name}
              aspectRatio="video"
              showDots={true}
              showArrows={true}
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full mt-1">
                    {project.type}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProject(project)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet</h3>
          <p className="text-gray-600 mb-4">Commencez par créer votre premier projet</p>
          <Button onClick={handleAddProject}>
            <Plus className="w-4 h-4 mr-2" />
            Créer un projet
          </Button>
        </div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        project={editingProject}
      />
    </div>
  );
};