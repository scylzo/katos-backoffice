export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  localisationSite: string;
  projetAdhere: string;
  status: 'En cours' | 'Terminé' | 'En attente';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  images: string[];
  type: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  supplier: string;
  description: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export interface ClientState {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

export interface MaterialState {
  materials: Material[];
  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterial: (id: string, material: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
}

export interface ProjectState {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}