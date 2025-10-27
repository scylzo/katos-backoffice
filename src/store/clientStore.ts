import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ClientState, Client } from '../types';

const mockClients: Client[] = [
  {
    id: '1',
    nom: 'Diallo',
    prenom: 'Amadou',
    localisationSite: 'Cité Keur Gorgui, Lot 25, Dakar',
    projetAdhere: 'Villa Kenza F3',
    status: 'En cours',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    nom: 'Sall',
    prenom: 'Fatou',
    localisationSite: 'Parcelles Assainies, Unité 16, Guédiawaye',
    projetAdhere: 'Villa Zahra F3',
    status: 'Terminé',
    createdAt: '2024-02-10',
  },
  {
    id: '3',
    nom: 'Ndiaye',
    prenom: 'Ousmane',
    localisationSite: 'Médina, Rue 15, Dakar',
    projetAdhere: 'Villa Fatima F4',
    status: 'En attente',
    createdAt: '2024-03-05',
  },
  {
    id: '4',
    nom: 'Ba',
    prenom: 'Aissatou',
    localisationSite: 'Yoff, Cité Djily Mbaye, Dakar',
    projetAdhere: 'Villa Amina F6',
    status: 'En cours',
    createdAt: '2024-03-12',
  },
  {
    id: '5',
    nom: 'Fall',
    prenom: 'Moussa',
    localisationSite: 'Rufisque, Quartier Keury Kao',
    projetAdhere: 'Villa Aicha F6',
    status: 'En attente',
    createdAt: '2024-03-18',
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