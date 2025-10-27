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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Vue d'ensemble de votre activité</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-lg transition-shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.name}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Derniers clients ajoutés
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {recentClients.length > 0 ? (
              recentClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{client.nom} {client.prenom}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{client.projetAdhere}</p>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <span
                      className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full ${
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
              <p className="text-sm sm:text-base text-gray-500 text-center py-3 sm:py-4">
                Aucun client enregistré
              </p>
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Matériaux en vitrine
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {materials.slice(0, 4).map((material) => (
              <div
                key={material.id}
                className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <img
                    src={material.image}
                    alt={material.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=400';
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{material.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{material.category}</p>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <p className="text-xs sm:text-sm font-semibold text-gold-600">{material.price.toLocaleString('fr-FR')} FCFA</p>
                </div>
              </div>
            ))}
            {materials.length === 0 && (
              <p className="text-sm sm:text-base text-gray-500 text-center py-3 sm:py-4">
                Aucun matériau disponible
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};