import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Client } from '../../types';

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
    name: client?.name || '',
    phone: client?.phone || '',
    email: client?.email || '',
    address: client?.address || '',
    projectType: client?.projectType || '',
    surface: client?.surface || 0,
    status: client?.status || 'En attente' as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!formData.address) newErrors.address = 'L\'adresse est requise';
    if (!formData.projectType) newErrors.projectType = 'Le type de projet est requis';
    if (!formData.surface || formData.surface <= 0) newErrors.surface = 'La surface doit être supérieure à 0';

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
      phone: '',
      email: '',
      address: '',
      projectType: '',
      surface: 0,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nom complet"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Amadou Diallo"
          />

          <Input
            label="Téléphone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            placeholder="77 123 45 67"
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="amadou.diallo@email.com"
        />

        <Input
          label="Adresse du chantier"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          error={errors.address}
          placeholder="Cité Keur Gorgui, Lot 25, Dakar"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Type de projet
            </label>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              className="block w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors font-medium appearance-none"
            >
              <option value="">Sélectionner un type</option>
              <option value="Villa moderne">Villa moderne</option>
              <option value="Appartement résidentiel">Appartement résidentiel</option>
              <option value="Maison R+1">Maison R+1</option>
              <option value="Rénovation traditionnelle">Rénovation traditionnelle</option>
              <option value="Extension moderne">Extension moderne</option>
              <option value="Immeuble commercial">Immeuble commercial</option>
              <option value="Boutique/Magasin">Boutique/Magasin</option>
            </select>
            {errors.projectType && (
              <p className="text-red-600 text-xs mt-1">{errors.projectType}</p>
            )}
          </div>

          <Input
            label="Surface (m²)"
            type="number"
            value={formData.surface}
            onChange={(e) => setFormData({ ...formData, surface: Number(e.target.value) })}
            error={errors.surface}
            placeholder="150"
            min="1"
          />
        </div>

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

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Annuler
          </Button>
          <Button type="submit">
            {client ? 'Modifier' : 'Créer'}
          </Button>
        </div>
        </form>
      </div>
    </Modal>
  );
};