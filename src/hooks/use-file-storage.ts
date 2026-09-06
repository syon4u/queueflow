import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

type FileStorageOptions = {
  bucketName?: string;
  folderPath?: string;
};

export const DOCUMENTS_BUCKET = 'appointment-documents';

/**
 * Generic Supabase Storage helper for uploading, listing and deleting files.
 * Adapted from the cue-flow-canvas prototype's use-file-storage hook to use
 * this app's AuthContext and a dedicated private bucket for appointment
 * document attachments (IDs, forms, supporting paperwork).
 */
export function useFileStorage(options: FileStorageOptions = {}) {
  const { bucketName = DOCUMENTS_BUCKET, folderPath = '' } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const buildPath = (fileName: string) =>
    folderPath ? `${folderPath}/${Date.now()}-${fileName}` : `${Date.now()}-${fileName}`;

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user) throw new Error('Authentication required to upload files');
    setIsLoading(true);
    setError(null);
    try {
      const filePath = buildPath(file.name);
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);
      if (uploadError) throw uploadError;
      return filePath;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFiles = async (files: File[]): Promise<(string | null)[]> => {
    if (!user) throw new Error('Authentication required to upload files');
    setIsLoading(true);
    setError(null);
    try {
      return await Promise.all(
        files.map(async (file) => {
          const filePath = buildPath(file.name);
          const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);
          if (uploadError) {
            console.error(`Error uploading ${file.name}:`, uploadError);
            return null;
          }
          return filePath;
        })
      );
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    if (!user) throw new Error('Authentication required to delete files');
    setIsLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase.storage.from(bucketName).remove([filePath]);
      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const listFiles = async (path: string = folderPath) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: listError } = await supabase.storage.from(bucketName).list(path, {
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (listError) throw listError;
      return data || [];
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getSignedUrl = async (filePath: string, expiresInSeconds = 3600) => {
    const { data, error: signError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresInSeconds);
    if (signError) {
      console.error('Error creating signed URL:', signError);
      return null;
    }
    return data?.signedUrl ?? null;
  };

  return { uploadFile, uploadFiles, deleteFile, listFiles, getSignedUrl, isLoading, error };
}
