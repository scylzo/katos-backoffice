import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ImageCarousel } from '../ui/ImageCarousel';
import type { Client } from '../../types';
import { useProjectStore } from '../../store/projectStore';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  client?: Client;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  client,
}) => {
  const [formData, setFormData] = useState({
    nom: client?.nom || '',
    prenom: client?.prenom || '',
    localisationSite: client?.localisationSite || '',
    projetAdhere: client?.projetAdhere || '',
    status: client?.status || 'En attente' as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { projects } = useProjectStore();
  const selectedProject = projects.find(p => p.name === formData.projetAdhere);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.nom) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom) newErrors.prenom = 'Le prénom est requis';
    if (!formData.localisationSite) newErrors.localisationSite = 'La localisation du site est requise';
    if (!formData.projetAdhere) newErrors.projetAdhere = 'Le projet adhéré est requis';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      nom: '',
      prenom: '',
      localisationSite: '',
      projetAdhere: '',
      status: 'En attente',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={client ? 'Modifier le client' : 'Nouveau client'}
      size="lg"
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Input
            label="Nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            error={errors.nom}
            placeholder="Diallo"
          />

          <Input
            label="Prénom"
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            error={errors.prenom}
            placeholder="Amadou"
          />
        </div>

        <Input
          label="Localisation du site"
          value={formData.localisationSite}
          onChange={(e) => setFormData({ ...formData, localisationSite: e.target.value })}
          error={errors.localisationSite}
          placeholder="Cité Keur Gorgui, Lot 25, Dakar"
        />

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Projet adhéré
          </label>
          <select
            value={formData.projetAdhere}
            onChange={(e) => setFormData({ ...formData, projetAdhere: e.target.value })}
            className="block w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors font-medium appearance-none"
          >
            <option value="">Sélectionner un projet</option>
            {projects.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projetAdhere && (
            <p className="text-red-600 text-xs mt-1">{errors.projetAdhere}</p>
          )}
        </div>

        {selectedProject && (
          <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Aperçu du projet</h4>
            <div className="space-y-3">
              <ImageCarousel
                images={selectedProject.images}
                alt={selectedProject.name}
                aspectRatio="wide"
                className="h-24 sm:h-32"
                showDots={true}
                showArrows={true}
              />
              <div>
                <h5 className="font-medium text-gray-900 text-sm sm:text-base">{selectedProject.name}</h5>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 sm:line-clamp-3">{selectedProject.description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Statut
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
            className="block w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors font-medium appearance-none"
          >
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Annuler
          </Button>
          <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2">
            {client ? 'Modifier' : 'Créer'}
          </Button>
        </div>
        </form>
      </div>
    </Modal>
  );
};