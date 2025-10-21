import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Material } from '../../types';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (material: Omit<Material, 'id'>) => void;
  material?: Material;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  material,
}) => {
  const [formData, setFormData] = useState({
    name: material?.name || '',
    category: material?.category || '',
    price: material?.price || 0,
    image: material?.image || '',
    supplier: material?.supplier || '',
    description: material?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Carrelage et Grès',
    'Peinture et Enduits',
    'Plomberie et Sanitaires',
    'Électricité et Éclairage',
    'Menuiserie Bois/Alu',
    'Quincaillerie',
    'Revêtement sol',
    'Isolation thermique',
    'Matériaux de construction',
    'Outillage',
    'Autre'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Le prix doit être supérieur à 0';
    if (!formData.supplier) newErrors.supplier = 'Le fournisseur est requis';
    if (!formData.description) newErrors.description = 'La description est requise';

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
      category: '',
      price: 0,
      image: '',
      supplier: '',
      description: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={material ? 'Modifier le matériau' : 'Nouveau matériau'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nom du matériau"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Carrelage Sénégalais Premium"
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="block w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors font-medium appearance-none"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-xs mt-1">{errors.category}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Prix (FCFA)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            error={errors.price}
            placeholder="25000"
            min="0"
            step="0.01"
          />

          <Input
            label="Fournisseur"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            error={errors.supplier}
            placeholder="SOCAREX Sénégal"
          />
        </div>

        <Input
          label="URL de l'image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://images.unsplash.com/photo-..."
        />

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors font-medium resize-none"
            rows={4}
            placeholder="Description détaillée du matériau..."
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
            {material ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};