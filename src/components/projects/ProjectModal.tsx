import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ImageCarousel } from '../ui/ImageCarousel';
import { Plus, X } from 'lucide-react';
import type { Project } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id'>) => void;
  project?: Project;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
}) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    type: project?.type || '',
    description: project?.description || '',
    images: project?.images || [],
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.type) newErrors.type = 'Le type est requis';
    if (!formData.description) newErrors.description = 'La description est requise';
    if (!formData.images || formData.images.length === 0) newErrors.images = 'Au moins une image est requise';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: '',
      description: '',
      images: [],
    });
    setNewImageUrl('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={project ? 'Modifier le projet' : 'Nouveau projet'}
      size="lg"
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom du projet"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              placeholder="Villa Kenza F3"
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Type de projet
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="block w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors font-medium appearance-none"
              >
                <option value="">Sélectionner un type</option>
                <option value="F1">F1</option>
                <option value="F2">F2</option>
                <option value="F3">F3</option>
                <option value="F4">F4</option>
                <option value="F5">F5</option>
                <option value="F6">F6</option>
                <option value="F7+">F7+</option>
              </select>
              {errors.type && (
                <p className="text-red-600 text-xs mt-1">{errors.type}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Images du projet
              </label>
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newImageUrl.trim()) {
                      setFormData({
                        ...formData,
                        images: [...formData.images, newImageUrl.trim()]
                      });
                      setNewImageUrl('');
                    }
                  }}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {errors.images && (
                <p className="text-red-600 text-xs mt-1">{errors.images}</p>
              )}
            </div>

            {formData.images.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Aperçu des images ({formData.images.length})
                </label>
                <ImageCarousel
                  images={formData.images}
                  alt="Aperçu du projet"
                  aspectRatio="video"
                  className="h-48"
                  showDots={true}
                  showArrows={true}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-16 h-12 object-cover rounded border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== index)
                          });
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors font-medium resize-none"
              rows={4}
              placeholder="Description détaillée du projet..."
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Annuler
            </Button>
            <Button type="submit">
              {project ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};