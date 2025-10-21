import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Phone, Mail, MapPin, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ClientModal } from '../components/clients/ClientModal';
import { useClientStore } from '../store/clientStore';
import type { Client } from '../types';

export const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useClientStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();

  const handleAddClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    addClient(clientData);
    toast.success('Profil client créé avec succès');
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleUpdateClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    if (selectedClient) {
      updateClient(selectedClient.id, clientData);
      toast.success('Client modifié avec succès');
    }
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      deleteClient(id);
      toast.success('Client supprimé avec succès');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(undefined);
  };

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'En cours':
        return 'bg-green-100 text-green-800';
      case 'Terminé':
        return 'bg-purple-100 text-purple-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">Gérez vos clients et leurs projets</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau client
        </Button>
      </div>


      <Card>
        {clients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {client.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {client.phone}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {client.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {client.projectType}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.surface} m²
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          client.status
                        )}`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert('Fonctionnalité de visualisation à venir')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClient(client)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun client enregistré
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par ajouter votre premier client
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau client
            </Button>
          </div>
        )}
      </Card>

      <ClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={selectedClient ? handleUpdateClient : handleAddClient}
        client={selectedClient}
      />
    </div>
  );
};