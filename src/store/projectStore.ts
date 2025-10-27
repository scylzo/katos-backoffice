import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProjectState, Project } from '../types';

// Import villa images
import F3_1 from '../assets/villas/F3_1.jpeg';
import F3_2 from '../assets/villas/F3_2.jpeg';
import F3_4 from '../assets/villas/F3_4.jpeg';
import F4_1 from '../assets/villas/F4_1.jpeg';
import F4_2 from '../assets/villas/F4_2.jpeg';
import F6_1 from '../assets/villas/F6_1.jpeg';
import F6_2 from '../assets/villas/F6_2.jpeg';
import F6_3 from '../assets/villas/F6_3.jpeg';

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [
        {
          id: 'villa-kenza-f3',
          name: 'Villa Kenza F3',
          type: 'F3',
          description: 'Villa moderne de type F3 avec un design contemporain. Comprend 3 pièces principales, cuisine équipée, salon spacieux et terrasse. Idéale pour une famille de 4 personnes.',
          images: [F3_1, F3_2, F3_4]
        },
        {
          id: 'villa-zahra-f3',
          name: 'Villa Zahra F3',
          type: 'F3',
          description: 'Villa élégante de type F3 avec finitions haut de gamme. Architecture traditionnelle revisitée avec des matériaux nobles. Jardin privatif et parking inclus.',
          images: [F3_2, F3_1, F3_4]
        },
        {
          id: 'villa-fatima-f4',
          name: 'Villa Fatima F4',
          type: 'F4',
          description: 'Spacieuse villa F4 avec 4 chambres et 2 salles de bain. Grande cuisine américaine ouverte sur le séjour. Terrasse couverte et espace barbecue extérieur.',
          images: [F4_1, F4_2]
        },
        {
          id: 'villa-amina-f6',
          name: 'Villa Amina F6',
          type: 'F6',
          description: 'Villa familiale F6 de standing avec 6 pièces. Double salon, bureau, 4 chambres avec dressing. Piscine privée et grand jardin paysager. Idéale pour grande famille.',
          images: [F6_1, F6_2, F6_3]
        },
        {
          id: 'villa-aicha-f6',
          name: 'Villa Aicha F6',
          type: 'F6',
          description: 'Villa de prestige F6 avec architecture moderne et équipements haut de gamme. Suite parentale avec dressing, 5 autres chambres, double garage et piscine à débordement.',
          images: [F6_2, F6_1, F6_3]
        }
      ],
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: `project-${Date.now()}`,
            },
          ],
        })),
      updateProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updatedProject } : project
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),
    }),
    {
      name: 'project-storage',
    }
  )
);