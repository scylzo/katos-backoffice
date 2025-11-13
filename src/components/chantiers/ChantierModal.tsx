import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { chantierService } from '../../services/chantierService';
import { userService } from '../../services/userService';
import { useClientStore } from '../../store/clientStore';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types/roles';
import type { FirebaseUser } from '../../types/firebase';
import { toast } from 'react-toastify';

interface ChantierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChantierModal: React.FC<ChantierModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { clients } = useClientStore();
  const { projects } = useProjectStore();
  const { user } = useAuthStore();
  const [chefs, setChefs] = useState<FirebaseUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    clientId: '',
    projectTemplateId: '',
    name: '',
    address: '',
    assignedChefId: '',
    startDate: '',
    plannedEndDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Charger les chefs de chantier
  useEffect(() => {
    const loadChefs = async () => {
      try {
        const availableChefs = await userService.getAvailableChefs();
        setChefs(availableChefs);
      } catch (error) {
        console.error('Erreur lors du chargement des chefs:', error);
        toast.error('Erreur lors du chargement des chefs de chantier');
      }
    };

    if (isOpen) {
      loadChefs();
    }
  }, [isOpen]);

  // Mettre à jour automatiquement le nom du chantier basé sur le client et projet sélectionnés
  useEffect(() => {
    if (formData.clientId && formData.projectTemplateId) {
      const selectedClient = clients.find(c => c.id === formData.clientId);
      const selectedProject = projects.find(p => p.id === formData.projectTemplateId);

      if (selectedClient && selectedProject) {
        const generatedName = `Chantier ${selectedClient.prenom} ${selectedClient.nom} - ${selectedProject.name}`;
        setFormData(prev => ({ ...prev, name: generatedName }));
      }
    }
  }, [formData.clientId, formData.projectTemplateId, clients, projects]);

  // Auto-remplir l'adresse avec la localisation du client
  useEffect(() => {
    if (formData.clientId) {
      const selectedClient = clients.find(c => c.id === formData.clientId);
      if (selectedClient) {
        setFormData(prev => ({ ...prev, address: selectedClient.localisationSite }));
      }
    }
  }, [formData.clientId, clients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) newErrors.clientId = 'Le client est requis';
    if (!formData.projectTemplateId) newErrors.projectTemplateId = 'Le projet template est requis';
    if (!formData.name) newErrors.name = 'Le nom du chantier est requis';
    if (!formData.address) newErrors.address = 'L\'adresse du chantier est requise';
    if (!formData.assignedChefId) newErrors.assignedChefId = 'Le chef de chantier est requis';
    if (!formData.startDate) newErrors.startDate = 'La date de début est requise';
    if (!formData.plannedEndDate) newErrors.plannedEndDate = 'La date de fin prévue est requise';

    // Vérifier que la date de fin est après la date de début
    if (formData.startDate && formData.plannedEndDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.plannedEndDate);
      if (endDate <= startDate) {
        newErrors.plannedEndDate = 'La date de fin doit être postérieure à la date de début';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const chantierId = await chantierService.createChantierFromTemplate(
        formData.clientId,
        formData.projectTemplateId,
        {
          name: formData.name,
          address: formData.address,
          assignedChefId: formData.assignedChefId,
          startDate: new Date(formData.startDate),
          plannedEndDate: new Date(formData.plannedEndDate)
        },
        user?.uid || 'system'
      );

      toast.success('Chantier créé avec succès!');
      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error('Erreur lors de la création du chantier:', error);
      toast.error(error.message || 'Erreur lors de la création du chantier');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      clientId: '',
      projectTemplateId: '',
      name: '',
      address: '',
      assignedChefId: '',
      startDate: '',
      plannedEndDate: ''
    });
    setErrors({});
    onClose();
  };

  // Filtrer les clients qui n'ont pas déjà un chantier
  const availableClients = clients.filter(client => client.invitationStatus === 'accepted');

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nouveau chantier"
      size="lg"
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Sélection du client */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Client *
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="block w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors font-medium appearance-none"
            >
              <option value="">Sélectionner un client</option>
              {availableClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.prenom} {client.nom} - {client.email}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-red-600 text-xs mt-1">{errors.clientId}</p>
            )}
          </div>

          {/* Sélection du projet template */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Projet template *
            </label>
            <select
              value={formData.projectTemplateId}
              onChange={(e) => setFormData({ ...formData, projectTemplateId: e.target.value })}
              className="block w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors font-medium appearance-none"
            >
              <option value="">Sélectionner un projet</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} {project.type} - {project.duration}j - {project.price}€
                </option>
              ))}
            </select>
            {errors.projectTemplateId && (
              <p className="text-red-600 text-xs mt-1">{errors.projectTemplateId}</p>
            )}
          </div>

          {/* Nom du chantier */}
          <Input
            label="Nom du chantier *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Chantier Moussa Diop - Villa Moderne"
          />

          {/* Adresse du chantier */}
          <Input
            label="Adresse du chantier *"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={errors.address}
            placeholder="Cité Keur Gorgui, Lot 25, Dakar"
          />

          {/* Chef de chantier assigné */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Chef de chantier *
            </label>
            <select
              value={formData.assignedChefId}
              onChange={(e) => setFormData({ ...formData, assignedChefId: e.target.value })}
              className="block w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors font-medium appearance-none"
            >
              <option value="">Sélectionner un chef de chantier</option>
              {chefs.map((chef) => {
                let roleLabel = '';
                if (chef.role === UserRole.CHEF) {
                  roleLabel = 'Chef de chantier';
                } else if (chef.role === UserRole.ADMIN && chef.isChef) {
                  roleLabel = 'Admin + Chef';
                } else if (chef.role === UserRole.SUPER_ADMIN) {
                  roleLabel = 'Super Admin';
                } else {
                  roleLabel = 'Administrateur';
                }

                return (
                  <option key={chef.uid} value={chef.uid}>
                    {chef.displayName} - {roleLabel}
                  </option>
                );
              })}
            </select>
            {errors.assignedChefId && (
              <p className="text-red-600 text-xs mt-1">{errors.assignedChefId}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date de début *"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              error={errors.startDate}
              min={new Date().toISOString().split('T')[0]} // Au minimum aujourd'hui
            />

            <Input
              label="Date de fin prévue *"
              type="date"
              value={formData.plannedEndDate}
              onChange={(e) => setFormData({ ...formData, plannedEndDate: e.target.value })}
              error={errors.plannedEndDate}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto order-2 sm:order-1"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto order-1 sm:order-2"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer le chantier'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};