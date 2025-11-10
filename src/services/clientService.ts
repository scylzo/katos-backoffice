import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { FirebaseClient } from '../types/firebase';

export class ClientService {
  private collectionName = 'clients';

  // Ajouter un nouveau client
  async addClient(clientData: Omit<FirebaseClient, 'id' | 'createdAt' | 'invitationStatus'>): Promise<string> {
    console.log('Ajout client dans Firebase:', clientData);
    const clientRef = collection(db, this.collectionName);

    // Nettoyer les valeurs undefined
    const cleanedData: any = {};
    Object.entries(clientData).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanedData[key] = value;
      }
    });

    const newClient = {
      ...cleanedData,
      invitationStatus: 'pending' as const,
      createdAt: Timestamp.now()
    };

    console.log('Données nettoyées pour Firebase:', newClient);
    const docRef = await addDoc(clientRef, newClient);
    console.log('Client ajouté avec ID:', docRef.id);
    return docRef.id;
  }

  // Récupérer tous les clients
  async getClients(): Promise<FirebaseClient[]> {
    const clientRef = collection(db, this.collectionName);
    const q = query(clientRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseClient));
  }

  // Récupérer un client par son ID
  async getClientById(id: string): Promise<FirebaseClient | null> {
    try {
      const clientRef = doc(db, this.collectionName, id);
      const snapshot = await getDoc(clientRef);

      if (!snapshot.exists()) {
        return null;
      }

      return {
        id: snapshot.id,
        ...snapshot.data()
      } as FirebaseClient;
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      return null;
    }
  }

  // Mettre à jour un client
  async updateClient(id: string, updates: Partial<Omit<FirebaseClient, 'id' | 'createdAt'>>): Promise<void> {
    const clientRef = doc(db, this.collectionName, id);
    await updateDoc(clientRef, updates);
  }

  // Récupérer un client par son ID utilisateur
  async getClientByUserId(userId: string): Promise<FirebaseClient | null> {
    const clientRef = collection(db, this.collectionName);
    const q = query(clientRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as FirebaseClient;
  }

  // Récupérer un client par email
  async getClientByEmail(email: string): Promise<FirebaseClient | null> {
    const clientRef = collection(db, this.collectionName);
    const q = query(clientRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as FirebaseClient;
  }

  // Supprimer un client
  async deleteClient(id: string): Promise<void> {
    const clientRef = doc(db, this.collectionName, id);
    await deleteDoc(clientRef);
  }

  // Écouter les changements en temps réel
  subscribeToClients(callback: (clients: FirebaseClient[]) => void): () => void {
    console.log('Démarrage de l\'écoute des clients...');
    const clientRef = collection(db, this.collectionName);
    const q = query(clientRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      console.log('Changement détecté dans la collection clients. Nombre de docs:', snapshot.docs.length);
      const clients = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Document client:', doc.id, data);
        return {
          id: doc.id,
          ...data
        } as FirebaseClient;
      });
      console.log('Envoi des clients au callback:', clients.length);
      callback(clients);
    });
  }
}

export const clientService = new ClientService();