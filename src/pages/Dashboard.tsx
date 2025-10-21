import React from 'react';
import { Users, Building, Clock, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useClientStore } from '../store/clientStore';
import { useMaterialStore } from '../store/materialStore';

export const Dashboard: React.FC = () => {
  const { clients } = useClientStore();
  const { materials } = useMaterialStore();

  const stats = [
    {
      name: 'Total Clients',
      value: clients.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Projets en cours',
      value: clients.filter(client => client.status === 'En cours').length,
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Projets en attente',
      value: clients.filter(client => client.status === 'En attente').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Projets terminés',
      value: clients.filter(client => client.status === 'Terminé').length,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentClients = clients.slice(-3).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Derniers clients ajoutés
          </h3>
          <div className="space-y-3">
            {recentClients.length > 0 ? (
              recentClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.projectType}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        client.status === 'En cours'
                          ? 'bg-green-100 text-green-800'
                          : client.status === 'Terminé'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucun client enregistré
              </p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Matériaux en vitrine
          </h3>
          <div className="space-y-3">
            {materials.slice(0, 4).map((material) => (
              <div
                key={material.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={material.image}
                    alt={material.name}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=400';
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{material.name}</p>
                    <p className="text-sm text-gray-600">{material.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gold-600">{material.price.toLocaleString('fr-FR')} FCFA</p>
                </div>
              </div>
            ))}
            {materials.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Aucun matériau disponible
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};