import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ClientState, Client } from '../types';

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Amadou Diallo',
    phone: '77 123 45 67',
    email: 'amadou.diallo@email.com',
    address: 'Cité Keur Gorgui, Lot 25, Dakar',
    projectType: 'Villa moderne',
    surface: 180,
    status: 'En cours',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Fatou Sall',
    phone: '78 987 65 43',
    email: 'fatou.sall@email.com',
    address: 'Parcelles Assainies, Unité 16, Guédiawaye',
    projectType: 'Appartement résidentiel',
    surface: 120,
    status: 'Terminé',
    createdAt: '2024-02-10',
  },
  {
    id: '3',
    name: 'Ousmane Ndiaye',
    phone: '76 112 233 44',
    email: 'ousmane.ndiaye@email.com',
    address: 'Médina, Rue 15, Dakar',
    projectType: 'Rénovation traditionnelle',
    surface: 220,
    status: 'En attente',
    createdAt: '2024-03-05',
  },
];

export const useClientStore = create<ClientState>()(
  persist(
    (set, get) => ({
      clients: mockClients,
      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set({ clients: [...get().clients, newClient] });
      },
      updateClient: (id, updates) => {
        set({
          clients: get().clients.map(client =>
            client.id === id ? { ...client, ...updates } : client
          )
        });
      },
      deleteClient: (id) => {
        set({
          clients: get().clients.filter(client => client.id !== id)
        });
      },
    }),
    {
      name: 'client-storage',
    }
  )
);