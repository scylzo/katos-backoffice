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
import { storageService } from './storageService';
import type { FirebaseProject } from '../types/firebase';

export class ProjectService {
  private collectionName = 'projects';

  // Ajouter un nouveau projet
  async addProject(projectData: Omit<FirebaseProject, 'id' | 'createdAt'>): Promise<string> {
    const projectRef = collection(db, this.collectionName);
    const newProject = {
      ...projectData,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(projectRef, newProject);
    return docRef.id;
  }

  // Récupérer tous les projets
  async getProjects(): Promise<FirebaseProject[]> {
    const projectRef = collection(db, this.collectionName);
    const q = query(projectRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseProject));
  }

  // Mettre à jour un projet
  async updateProject(id: string, updates: Partial<Omit<FirebaseProject, 'id' | 'createdAt'>>): Promise<void> {
    const projectRef = doc(db, this.collectionName, id);
    await updateDoc(projectRef, updates);
  }

  // Supprimer un projet
  async deleteProject(id: string): Promise<void> {
    try {
      // Récupérer le projet pour supprimer ses images
      const projects = await this.getProjects();
      const project = projects.find(p => p.id === id);

      // Supprimer les images du Storage
      if (project?.images) {
        for (const imageUrl of project.images) {
          try {
            await storageService.deleteImage(imageUrl);
          } catch (error) {
            console.warn('Erreur suppression image:', error);
          }
        }
      }

      // Supprimer le document Firestore
      const projectRef = doc(db, this.collectionName, id);
      await deleteDoc(projectRef);
    } catch (error) {
      console.error('Erreur suppression projet:', error);
      throw error;
    }
  }

  // Écouter les changements en temps réel
  subscribeToProjects(callback: (projects: FirebaseProject[]) => void): () => void {
    const projectRef = collection(db, this.collectionName);
    const q = query(projectRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseProject));
      callback(projects);
    });
  }

  // Rechercher par type
  async getProjectsByType(type: string): Promise<FirebaseProject[]> {
    const projectRef = collection(db, this.collectionName);
    const snapshot = await getDocs(projectRef);

    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseProject))
      .filter(project => project.type === type);
  }

  // Upload multiple images pour un projet
  async uploadProjectImages(files: File[], projectId?: string): Promise<string[]> {
    const folderPath = projectId ? `projects/${projectId}` : 'projects/temp';
    const uploadPromises = files.map(file =>
      storageService.uploadImage(file, folderPath)
    );

    return Promise.all(uploadPromises);
  }
}

export const projectService = new ProjectService();