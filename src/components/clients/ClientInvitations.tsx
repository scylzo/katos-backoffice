import React, { useState, useEffect } from 'react';
import { Mail, Send, Check, X, Clock, AlertCircle, RotateCcw, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConfirmModal } from '../ui/ConfirmModal';
import { invitationService } from '../../services/invitationService';
import type { FirebaseClient, FirebaseInvitation } from '../../types/firebase';
import { useConfirm } from '../../hooks/useConfirm';

interface ClientInvitationsProps {
  client: FirebaseClient;
  onUpdate?: () => void;
}

export const ClientInvitations: React.FC<ClientInvitationsProps> = ({
  client,
  onUpdate
}) => {
  const [invitations, setInvitations] = useState<FirebaseInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [credentials, setCredentials] = useState<string | null>(null);
  const { confirmState, confirm, handleConfirm, handleClose } = useConfirm();

  // Charger les invitations du client
  const loadInvitations = async () => {
    if (!client.id) return;

    setLoading(true);
    try {
      const clientInvitations = await invitationService.getClientInvitations(client.id);
      setInvitations(clientInvitations);
    } catch (error) {
      console.error('Erreur lors du chargement des invitations:', error);
      toast.error('Impossible de charger les invitations');
    } finally {
      setLoading(false);
    }
  };

  // Créer un compte client avec mot de passe temporaire
  const createClientAccount = async () => {
    if (!client.id || !client.email) {
      toast.error('Client invalide - email requis');
      return;
    }

    setCreatingAccount(true);
    try {
      const result = await invitationService.createClientAccount(client.id, client.email);

      if (result.success) {
        setCredentials(result.credentials || '');
        toast.success('Compte créé avec succès. Vous allez être déconnecté du backoffice et devrez vous reconnecter.');
        await loadInvitations();
        onUpdate?.();

        // Redirection vers la page de login après un délai
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        toast.error(result.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      toast.error('Erreur lors de la création du compte');
    } finally {
      setCreatingAccount(false);
    }
  };

  // Copier le lien d'invitation web
  const copyInvitationLink = async (token: string) => {
    const invitationUrl = invitationService.generateInvitationUrl(token);
    try {
      await navigator.clipboard.writeText(invitationUrl);
      toast.success('Lien web copié dans le presse-papiers');
    } catch (error) {
      // Fallback pour les navigateurs qui ne supportent pas l'API clipboard
      const textArea = document.createElement('textarea');
      textArea.value = invitationUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Lien web copié dans le presse-papiers');
    }
  };

  // Copier le lien direct
  const copyDirectLink = async (token: string) => {
    const directUrl = invitationService.generateDirectUrl(token);
    try {
      await navigator.clipboard.writeText(directUrl);
      toast.success('Lien direct copié dans le presse-papiers');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = directUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Lien direct copié dans le presse-papiers');
    }
  };

  // Supprimer une invitation
  const deleteInvitation = async (invitationId: string) => {
    try {
      await invitationService.deleteInvitation(invitationId);
      toast.success('Invitation supprimée');
      await loadInvitations();
      onUpdate?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Confirmer la suppression
  const handleDeleteInvitation = (invitation: FirebaseInvitation) => {
    confirm(
      () => deleteInvitation(invitation.id!),
      {
        title: 'Supprimer l\'invitation',
        message: `Êtes-vous sûr de vouloir supprimer cette invitation envoyée le ${invitation.createdAt.toDate().toLocaleDateString('fr-FR')} ?`,
        confirmText: 'Supprimer',
        type: 'danger'
      }
    );
  };

  // Charger les invitations au montage
  useEffect(() => {
    loadInvitations();
  }, [client.id]);

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!client.id) return;

    const unsubscribe = invitationService.subscribeToInvitations((allInvitations) => {
      const clientInvitations = allInvitations.filter(inv => inv.clientId === client.id);
      setInvitations(clientInvitations);
    });

    return unsubscribe;
  }, [client.id]);

  const getStatusIcon = (status: FirebaseInvitation['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'sent':
        return <Send className="w-4 h-4 text-blue-500" />;
      case 'accepted':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'declined':
        return <X className="w-4 h-4 text-red-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: FirebaseInvitation['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'sent':
        return 'Envoyée';
      case 'accepted':
        return 'Acceptée';
      case 'declined':
        return 'Déclinée';
      case 'expired':
        return 'Expirée';
      default:
        return 'Inconnue';
    }
  };

  const getStatusColor = (status: FirebaseInvitation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCreateAccount = () => {
    // Peut créer un compte si :
    // 1. Le client a un email
    // 2. Le client n'a pas encore de compte (pas d'userId)
    if (!client.email) return false;
    return !client.userId;
  };

  const getAccountMessage = () => {
    if (!client.email) {
      return 'Aucun email renseigné pour ce client';
    }

    if (client.userId) {
      return `Client connecté depuis le ${client.acceptedAt?.toDate().toLocaleDateString('fr-FR') || 'date inconnue'}`;
    }

    return 'Aucun compte créé';
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Compte App Mobile
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {canCreateAccount() && (
            <Button
              onClick={createClientAccount}
              disabled={creatingAccount}
              size="sm"
              className="flex items-center gap-2"
            >
              {creatingAccount ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {creatingAccount ? 'Création...' : 'Créer le compte'}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Statut de connexion */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Email du client :</span>
            <span className="font-medium text-gray-900">{client.email || 'Non renseigné'}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Statut du compte :</span>
            <span className="text-gray-900">{getAccountMessage()}</span>
          </div>
        </div>

        {/* Identifiants de connexion créés */}
        {credentials && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Compte créé avec succès
                </h4>
                <p className="text-sm text-green-800 mb-3">
                  Le compte a été créé. Transmettez ces identifiants au client pour qu'il puisse se connecter.
                </p>
                <div className="bg-white border border-green-300 rounded p-3">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{credentials}</pre>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={() => navigator.clipboard.writeText(credentials)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-green-600 border-green-300 hover:bg-green-100"
                  >
                    <Copy className="w-4 h-4" />
                    Copier les identifiants
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => setCredentials(null)}
                size="sm"
                variant="outline"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Liste des invitations */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RotateCcw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        ) : invitations.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">
              Historique des invitations ({invitations.length})
            </h4>
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(invitation.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invitation.status)}`}
                      >
                        {getStatusText(invitation.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Créée le {invitation.createdAt.toDate().toLocaleDateString('fr-FR')} à{' '}
                      {invitation.createdAt.toDate().toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {invitation.expiresAt && (
                      <p className="text-xs text-gray-500">
                        Expire le {invitation.expiresAt.toDate().toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {invitation.acceptedAt && (
                      <p className="text-xs text-green-600">
                        Acceptée le {invitation.acceptedAt.toDate().toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(invitation.status === 'pending' || invitation.status === 'sent') && invitation.token && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyInvitationLink(invitation.token!)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Copier le lien d'invitation"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                  {invitation.status !== 'accepted' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteInvitation(invitation)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Supprimer l'invitation"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Mail className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Aucune invitation envoyée</p>
          </div>
        )}

        {/* Message d'aide */}
        {!canCreateAccount() && client.email && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Info :</strong> Le compte a déjà été créé pour ce client.
              Il peut maintenant se connecter avec ses identifiants.
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        type={confirmState.type}
        loading={confirmState.loading}
      />
    </Card>
  );
};