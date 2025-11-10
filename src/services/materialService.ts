import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { FirebaseMaterial } from '../types/firebase';

export class MaterialService {
  private collectionName = 'materials';

  // Ajouter un nouveau matériau
  async addMaterial(materialData: Omit<FirebaseMaterial, 'id' | 'createdAt'>): Promise<string> {
    const materialRef = collection(db, this.collectionName);
    const newMaterial = {
      ...materialData,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(materialRef, newMaterial);
    return docRef.id;
  }

  // Récupérer tous les matériaux
  async getMaterials(): Promise<FirebaseMaterial[]> {
    const materialRef = collection(db, this.collectionName);
    const q = query(materialRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseMaterial));
  }

  // Mettre à jour un matériau
  async updateMaterial(id: string, updates: Partial<Omit<FirebaseMaterial, 'id' | 'createdAt'>>): Promise<void> {
    const materialRef = doc(db, this.collectionName, id);
    await updateDoc(materialRef, updates);
  }

  // Supprimer un matériau
  async deleteMaterial(id: string): Promise<void> {
    const materialRef = doc(db, this.collectionName, id);
    await deleteDoc(materialRef);
  }

  // Écouter les changements en temps réel
  subscribeToMaterials(callback: (materials: FirebaseMaterial[]) => void): () => void {
    const materialRef = collection(db, this.collectionName);
    const q = query(materialRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const materials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseMaterial));
      callback(materials);
    });
  }

  // Rechercher par catégorie
  async getMaterialsByCategory(category: string): Promise<FirebaseMaterial[]> {
    const materialRef = collection(db, this.collectionName);
    const snapshot = await getDocs(materialRef);

    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseMaterial))
      .filter(material => material.category === category);
  }
}

export const materialService = new MaterialService();