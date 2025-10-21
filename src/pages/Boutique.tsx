import React, { useState } from 'react';
import { Plus, Edit, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MaterialModal } from '../components/boutique/MaterialModal';
import { useMaterialStore } from '../store/materialStore';
import type { Material } from '../types';

export const Boutique: React.FC = () => {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useMaterialStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>();
  const handleAddMaterial = (materialData: Omit<Material, 'id'>) => {
    addMaterial(materialData);
    toast.success('Matériau ajouté avec succès à la vitrine');
  };

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const handleUpdateMaterial = (materialData: Omit<Material, 'id'>) => {
    if (selectedMaterial) {
      updateMaterial(selectedMaterial.id, materialData);
      toast.success('Matériau modifié avec succès');
    }
  };

  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matériau ?')) {
      deleteMaterial(id);
      toast.success('Matériau supprimé avec succès');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMaterial(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Boutique</h1>
          <p className="text-gray-600">Gérez la vitrine des matériaux de second œuvre</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau produit
        </Button>
      </div>


      {materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {materials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow h-[420px]">
              <div className="flex flex-col h-full space-y-4">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={material.image}
                    alt={material.name}
                    className="w-full h-40 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=400';
                    }}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 h-10 flex-1">
                      {material.name}
                    </h3>
                    <span className="text-sm font-bold text-gold-600 whitespace-nowrap flex-shrink-0">
                      {material.price.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {material.category}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">
                    {material.description}
                  </p>

                  <p className="text-xs text-gray-500">
                    Fournisseur: {material.supplier}
                  </p>
                </div>

                <div className="flex space-x-2 pt-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditMaterial(material)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteMaterial(material.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun matériau disponible
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par ajouter des matériaux à votre vitrine
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau produit
            </Button>
          </div>
        </Card>
      )}

      <MaterialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={selectedMaterial ? handleUpdateMaterial : handleAddMaterial}
        material={selectedMaterial}
      />
    </div>
  );
};