export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  projectType: string;
  surface: number;
  status: 'En cours' | 'Terminé' | 'En attente';
  createdAt: string;
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