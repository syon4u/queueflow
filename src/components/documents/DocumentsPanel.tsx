import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { useFileStorage } from '@/hooks/use-file-storage';
import { FileText, Image as ImageIcon, Trash2, ExternalLink } from 'lucide-react';
import DocumentUpload from './DocumentUpload';

type DocumentInfo = {
  id: string;
  name: string;
  path: string;
  isImage: boolean;
};

type StorageListEntry = {
  id?: string | null;
  name: string;
  metadata?: { mimetype?: string } | null;
};

/**
 * Staff-facing document center: upload and manage appointment-related
 * documents (ID scans, intake forms, supporting paperwork) in a private
 * Supabase Storage bucket. Adapted from the cue-flow-canvas prototype's
 * FileStoragePage, wired into this app's staff dashboard, toast, and auth
 * primitives, and switched to signed URLs since the bucket is private.
 */
export const DocumentsPanel: React.FC = () => {
  const { toast } = useToast();
  const { listFiles, deleteFile, getSignedUrl, isLoading } = useFileStorage();
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadDocuments = useCallback(async () => {
    try {
      const entries = (await listFiles()) as StorageListEntry[];
      const mapped = entries
        .filter((entry) => entry.name && !entry.name.endsWith('/'))
        .map((entry) => ({
          id: entry.id ?? entry.name,
          name: entry.name.replace(/^\d+-/, ''),
          path: entry.name,
          isImage:
            entry.metadata?.mimetype?.startsWith('image/') ||
            /\.(jpe?g|png|gif|webp)$/i.test(entry.name),
        }));
      setDocuments(mapped);
    } catch (err) {
      console.error('Error fetching documents:', err);
      toast({
        title: 'Could not load documents',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const handleOpen = async (doc: DocumentInfo) => {
    const url = await getSignedUrl(doc.path);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast({ title: 'Could not open document', variant: 'destructive' });
    }
  };

  const handleDelete = async (doc: DocumentInfo) => {
    if (!window.confirm(`Delete ${doc.name}? This cannot be undone.`)) return;
    const success = await deleteFile(doc.path);
    if (success) {
      toast({ title: 'Document deleted', description: doc.name });
      setRefreshKey((k) => k + 1);
    } else {
      toast({ title: 'Delete failed', description: doc.name, variant: 'destructive' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Attach ID scans, intake forms, or other supporting paperwork to an appointment record.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUpload onUploadComplete={() => setRefreshKey((k) => k + 1)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>Files attached by staff, stored privately per location.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : documents.length > 0 ? (
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {doc.isImage ? (
                      <ImageIcon className="h-4 w-4 shrink-0 text-blue-500" />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpen(doc)}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => handleDelete(doc)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">No documents uploaded yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPanel;
