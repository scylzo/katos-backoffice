import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Users as UsersIcon, Shield, Key, Eye, Trash2, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { RoleGuard } from '../components/RoleGuard';
import { useAuthStore } from '../store/authStore';
import { useConfirm } from '../hooks/useConfirm';
import { invitationService, type InvitationCode } from '../services/invitationService';


export const Users: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [invitationCodes, setInvitationCodes] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingCode, setCreatingCode] = useState(false);

  const { userData } = useAuthStore();
  const { confirmState, confirm, handleConfirm, handleClose } = useConfirm();

  useEffect(() => {
    loadInvitationCodes();
  }, []);

  const loadInvitationCodes = async () => {
    setLoading(true);
    try {
      const codes = await invitationService.getAllInvitationCodes();
      setInvitationCodes(codes);
    } catch (error) {
      toast.error('Erreur lors du chargement des codes');
    } finally {
      setLoading(false);
    }
  };


  const handleGenerateCode = async () => {
    if (!userData) {
      toast.error('Vous devez être connecté');
      return;
    }

    try {
      setCreatingCode(true);
      const newCode = await invitationService.createInvitationCode(userData.uid);

      if (newCode) {
        setGeneratedCode(newCode.code);
        setShowCodeModal(true);
        await loadInvitationCodes(); // Recharger la liste
        toast.success('Code d\'invitation généré avec succès');
      } else {
        toast.error('Erreur lors de la génération du code');
      }
    } catch (error) {
      toast.error('Erreur lors de la génération du code');
    } finally {
      setCreatingCode(false);
    }
  };

  const handleDeleteCode = (code: InvitationCode) => {
    if (!userData) return;

    confirm(
      async () => {
        try {
          const success = await invitationService.deleteInvitationCode(code.id!);
          if (success) {
            toast.success('Code supprimé avec succès');
            await loadInvitationCodes();
          } else {
            toast.error('Erreur lors de la suppression du code');
          }
        } catch (error) {
          toast.error('Erreur lors de la suppression du code');
        }
      },
      {
        title: 'Supprimer le code',
        message: `Êtes-vous sûr de vouloir supprimer le code "${code.code}" ? Cette action est irréversible.`,
        confirmText: 'Supprimer',
        type: 'danger'
      }
    );
  };

  const copyCodeToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copié dans le presse-papiers');
    } catch (error) {
      // Fallback pour les anciens navigateurs
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Code copié dans le presse-papiers');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'used':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'used':
        return 'Utilisé';
      case 'expired':
        return 'Expiré';
      default:
        return 'Inconnu';
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Key className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Codes d'invitation</h1>
            <p className="text-gray-600">Générez des codes pour permettre aux administrateurs de s'inscrire</p>
          </div>
        </div>

        <RoleGuard requiredPermission="canManageUsers">
          <Button onClick={handleGenerateCode} loading={creatingCode} icon={<Plus className="w-4 h-4" />}>
            Générer un code
          </Button>
        </RoleGuard>
      </div>

      {/* Liste des codes d'invitation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Codes d'invitation ({invitationCodes.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expire le
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invitationCodes.map((code) => {
                return (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {code.code}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(code.status)}`}>
                        {getStatusText(code.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {code.createdAt.toDate().toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {code.expiresAt.toDate().toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {code.status === 'active' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyCodeToClipboard(code.code)}
                            icon={<Copy className="w-4 h-4" />}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            Copier
                          </Button>
                        )}
                        <RoleGuard requiredPermission="canDeleteUsers">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCode(code)}
                            icon={<Trash2 className="w-4 h-4" />}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Supprimer
                          </Button>
                        </RoleGuard>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {invitationCodes.length === 0 && (
            <div className="text-center py-12">
              <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun code d'invitation</h3>
              <p className="text-gray-500 mb-4">Générez votre premier code d'invitation</p>
              <RoleGuard requiredPermission="canManageUsers">
                <Button onClick={handleGenerateCode} loading={creatingCode} icon={<Plus className="w-4 h-4" />}>
                  Générer un code
                </Button>
              </RoleGuard>
            </div>
          )}
        </div>
      </div>

      {/* Modal de visualisation du code généré */}
      <Modal
        isOpen={showCodeModal}
        onClose={() => {
          setShowCodeModal(false);
          setGeneratedCode(null);
        }}
        title="Code d'invitation généré"
      >
        {generatedCode && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Key className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Code d'invitation
                  </h3>
                  <p className="text-sm text-gray-600">Valable 7 jours</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code à transmettre
                </label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
                  <code className="text-2xl font-mono text-gray-800 tracking-wider font-bold">
                    {generatedCode}
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Instructions
                  </h4>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• Transmettez ce code à l'administrateur</li>
                    <li>• Il devra s'inscrire sur la page d'inscription</li>
                    <li>• Le code expire dans 7 jours</li>
                    <li>• Un code ne peut être utilisé qu'une seule fois</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCodeModal(false);
                  setGeneratedCode(null);
                }}
              >
                Fermer
              </Button>
              <Button onClick={() => copyCodeToClipboard(generatedCode)}>
                <Copy className="w-4 h-4 mr-2" />
                Copier le code
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        type={confirmState.type}
      />
    </div>
  );
};