import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';
import { clientService } from '../services/clientService';
import type { FirebaseClient } from '../types/firebase';

// Conversion des types pour compatibilité
interface ClientForApp {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  localisationSite: string;
  projetAdhere: string;
  status: 'En cours' | 'Terminé' | 'En attente';
  invitationStatus: 'pending' | 'sent' | 'accepted' | 'declined';
  invitationToken?: string;
  userId?: string;
  createdAt: string;
  invitedAt?: string;
  acceptedAt?: string;
}

interface FirebaseClientState {
  clients: ClientForApp[];
  loading: boolean;
  error: string | null;
  addClient: (client: Omit<ClientForApp, 'id' | 'createdAt'>) => Promise<boolean>;
  updateClient: (id: string, updates: Partial<ClientForApp>) => Promise<boolean>;
  deleteClient: (id: string) => Promise<boolean>;
  initializeClients: () => void;
  setClients: (clients: ClientForApp[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Fonction pour convertir FirebaseClient vers ClientForApp
const convertFirebaseClient = (firebaseClient: FirebaseClient): ClientForApp => ({
  id: firebaseClient.id!,
  nom: firebaseClient.nom,
  prenom: firebaseClient.prenom,
  email: firebaseClient.email,
  localisationSite: firebaseClient.localisationSite,
  projetAdhere: firebaseClient.projetAdhere,
  status: firebaseClient.status,
  invitationStatus: firebaseClient.invitationStatus,
  invitationToken: firebaseClient.invitationToken,
  userId: firebaseClient.userId,
  createdAt: firebaseClient.createdAt.toDate().toISOString().split('T')[0],
  invitedAt: firebaseClient.invitedAt?.toDate().toISOString().split('T')[0],
  acceptedAt: firebaseClient.acceptedAt?.toDate().toISOString().split('T')[0]
});

// Fonction pour convertir ClientForApp vers FirebaseClient
const convertToFirebaseClient = (client: Omit<ClientForApp, 'id' | 'createdAt' | 'invitationStatus'>): Omit<FirebaseClient, 'id' | 'createdAt' | 'invitationStatus'> => {
  const firebaseClient: any = {
    nom: client.nom,
    prenom: client.prenom,
    email: client.email,
    localisationSite: client.localisationSite,
    projetAdhere: client.projetAdhere,
    status: client.status
  };

  // Ajouter seulement les champs non undefined
  if (client.invitationToken) {
    firebaseClient.invitationToken = client.invitationToken;
  }
  if (client.userId) {
    firebaseClient.userId = client.userId;
  }
  if (client.invitedAt) {
    firebaseClient.invitedAt = Timestamp.fromDate(new Date(client.invitedAt));
  }
  if (client.acceptedAt) {
    firebaseClient.acceptedAt = Timestamp.fromDate(new Date(client.acceptedAt));
  }

  return firebaseClient;
};

export const useClientStore = create<FirebaseClientState>((set, get) => ({
  clients: [],
  loading: false,
  error: null,

  addClient: async (clientData) => {
    try {
      set({ loading: true, error: null });
      const firebaseData = convertToFirebaseClient(clientData);
      const clientId = await clientService.addClient(firebaseData);
      console.log('Client ajouté avec succès, ID:', clientId);
      set({ loading: false });
      return true;
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du client:', error);
      set({
        error: error.message || 'Erreur lors de l\'ajout du client',
        loading: false
      });
      return false;
    }
  },

  updateClient: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const firebaseUpdates: any = {};

      if (updates.nom) firebaseUpdates.nom = updates.nom;
      if (updates.prenom) firebaseUpdates.prenom = updates.prenom;
      if (updates.email) firebaseUpdates.email = updates.email;
      if (updates.localisationSite) firebaseUpdates.localisationSite = updates.localisationSite;
      if (updates.projetAdhere) firebaseUpdates.projetAdhere = updates.projetAdhere;
      if (updates.status) firebaseUpdates.status = updates.status;
      if (updates.invitationStatus) firebaseUpdates.invitationStatus = updates.invitationStatus;
      if (updates.invitationToken) firebaseUpdates.invitationToken = updates.invitationToken;
      if (updates.userId) firebaseUpdates.userId = updates.userId;

      await clientService.updateClient(id, firebaseUpdates);
      set({ loading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors de la mise à jour du client',
        loading: false
      });
      return false;
    }
  },

  deleteClient: async (id) => {
    try {
      set({ loading: true, error: null });
      await clientService.deleteClient(id);
      set({ loading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors de la suppression du client',
        loading: false
      });
      return false;
    }
  },

  initializeClients: () => {
    console.log('Initialisation des clients...');
    set({ loading: true, error: null });

    // Écouter les changements en temps réel
    const unsubscribe = clientService.subscribeToClients((firebaseClients) => {
      console.log('Clients reçus de Firebase:', firebaseClients.length);
      const convertedClients = firebaseClients.map(convertFirebaseClient);
      console.log('Clients convertis:', convertedClients);
      set({
        clients: convertedClients,
        loading: false,
        error: null
      });
    });

    // Stocker la fonction de nettoyage pour pouvoir l'appeler plus tard si nécessaire
    (get() as any).unsubscribe = unsubscribe;
  },

  setClients: (clients) => set({ clients }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));