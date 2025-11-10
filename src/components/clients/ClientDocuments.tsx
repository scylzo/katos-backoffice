import React, { useState, useEffect } from 'react';
import { Download, Trash2, Eye, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useConfirm } from '../../hooks/useConfirm';
import { documentService } from '../../services/documentService';
import type { ClientDocument } from '../../types';

interface ClientDocumentsProps {
  clientId: string;
  clientName: string;
}

export const ClientDocuments: React.FC<ClientDocumentsProps> = ({
  clientId,
  clientName
}) => {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { confirmState, confirm, handleConfirm, handleClose } = useConfirm();

  useEffect(() => {
    const unsubscribe = documentService.subscribeToClientDocuments(
      clientId,
      (docs) => {
        setDocuments(docs);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [clientId]);

  const handleDeleteDocument = (document: ClientDocument) => {
    confirm(
      async () => {
        try {
          await documentService.deleteDocument(document.id, document.url);
          toast.success('Document supprimé avec succès');
        } catch (error) {
          toast.error('Erreur lors de la suppression du document');
        }
      },
      {
        title: 'Supprimer',
        message: `Êtes-vous sûr de vouloir supprimer le document "${document.name}" ? Cette action est irréversible.`,
        confirmText: 'Supprimer le document',
        type: 'danger'
      }
    );
  };

  const handleDownload = (document: ClientDocument) => {
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (document: ClientDocument) => {
    window.open(document.url, '_blank');
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-gray-600">Chargement des documents...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Documents de {clientName}
        </h3>
        <span className="text-sm text-gray-500">
          {documents.length} document{documents.length > 1 ? 's' : ''}
        </span>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((document) => (
            <Card key={document.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                {/* Header avec icône et type */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl">
                      {documentService.getFileIcon(document.mimeType)}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${documentService.getDocumentTypeColor(document.type)}`}>
                      {documentService.getDocumentTypeLabel(document.type)}
                    </span>
                  </div>
                </div>

                {/* Nom du document */}
                <div>
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                    {document.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {documentService.formatFileSize(document.size)}
                  </p>
                </div>

                {/* Description si disponible */}
                {document.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {document.description}
                  </p>
                )}

                {/* Date d'upload */}
                <p className="text-xs text-gray-400">
                  Ajouté le {new Date(document.uploadedAt).toLocaleDateString('fr-FR')}
                </p>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(document)}
                    className="flex-1 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(document)}
                    className="flex-1 text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    DL
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteDocument(document)}
                    className="p-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun document
            </h3>
            <p className="text-gray-500">
              {clientName} n'a pas encore uploadé de documents depuis l'application mobile.
            </p>
          </div>
        </Card>
      )}

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
    </div>
  );
};