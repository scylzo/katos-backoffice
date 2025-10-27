import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'villa-kenza-f3',
    name: 'Villa Kenza F3',
    type: 'F3',
    description: 'Villa moderne de type F3 avec un design contemporain. Comprend 3 pièces principales, cuisine équipée, salon spacieux et terrasse. Idéale pour une famille de 4 personnes.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop&crop=faces,entropy&auto=format&q=80'
  },
  {
    id: 'villa-zahra-f3',
    name: 'Villa Zahra F3',
    type: 'F3',
    description: 'Villa élégante de type F3 avec finitions haut de gamme. Architecture traditionnelle revisitée avec des matériaux nobles. Jardin privatif et parking inclus.',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&h=300&fit=crop&crop=faces,entropy&auto=format&q=80'
  },
  {
    id: 'villa-fatima-f4',
    name: 'Villa Fatima F4',
    type: 'F4',
    description: 'Spacieuse villa F4 avec 4 chambres et 2 salles de bain. Grande cuisine américaine ouverte sur le séjour. Terrasse couverte et espace barbecue extérieur.',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&h=300&fit=crop&crop=faces,entropy&auto=format&q=80'
  },
  {
    id: 'villa-amina-f6',
    name: 'Villa Amina F6',
    type: 'F6',
    description: 'Villa familiale F6 de standing avec 6 pièces. Double salon, bureau, 4 chambres avec dressing. Piscine privée et grand jardin paysager. Idéale pour grande famille.',
    image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&h=300&fit=crop&crop=faces,entropy&auto=format&q=80'
  },
  {
    id: 'villa-aicha-f6',
    name: 'Villa Aicha F6',
    type: 'F6',
    description: 'Villa de prestige F6 avec architecture moderne et équipements haut de gamme. Suite parentale avec dressing, 5 autres chambres, double garage et piscine à débordement.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&h=300&fit=crop&crop=faces,entropy&auto=format&q=80'
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectByName = (name: string): Project | undefined => {
  return projects.find(project => project.name === name);
};