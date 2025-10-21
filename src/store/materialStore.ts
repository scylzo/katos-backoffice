import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MaterialState, Material } from '../types';

const mockMaterials: Material[] = [
  {
    id: '1',
    name: 'Carrelage Sénégalais Premium',
    category: 'Carrelage et Grès',
    price: 28500,
    image: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=400',
    supplier: 'SOCAREX Sénégal',
    description: 'Carrelage haut de gamme fabriqué localement',
  },
  {
    id: '2',
    name: 'Peinture Tropicale',
    category: 'Peinture et Enduits',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    supplier: 'Peintures du Sahel',
    description: 'Peinture adaptée au climat tropical sénégalais',
  },
  {
    id: '3',
    name: 'Parquet Acacia Local',
    category: 'Revêtement sol',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    supplier: 'Bois de Casamance',
    description: 'Parquet en bois d\'acacia du Sénégal',
  },
  {
    id: '4',
    name: 'Robinetterie Moderne',
    category: 'Plomberie et Sanitaires',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    supplier: 'Hydraulique Dakar',
    description: 'Robinetterie résistante et économique',
  },
];

export const useMaterialStore = create<MaterialState>()(
  persist(
    (set, get) => ({
      materials: mockMaterials,
      addMaterial: (materialData) => {
        const newMaterial: Material = {
          ...materialData,
          id: Date.now().toString(),
        };
        set({ materials: [...get().materials, newMaterial] });
      },
      updateMaterial: (id, updates) => {
        set({
          materials: get().materials.map(material =>
            material.id === id ? { ...material, ...updates } : material
          )
        });
      },
      deleteMaterial: (id) => {
        set({
          materials: get().materials.filter(material => material.id !== id)
        });
      },
    }),
    {
      name: 'material-storage',
    }
  )
);