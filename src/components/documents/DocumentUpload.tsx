import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { useFileStorage } from '@/hooks/use-file-storage';
import { X, Upload } from 'lucide-react';

type DocumentUploadProps = {
  onUploadComplete?: () => void;
  maxFiles?: number;
  allowedFileTypes?: string[];
};

const DEFAULT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Upload widget for appointment-related documents (ID scans, forms, supporting
 * paperwork). Adapted from the cue-flow-canvas prototype's FileUpload
 * component to use this app's toast/spinner primitives and private storage
 * bucket.
 */
const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadComplete,
  maxFiles = 5,
  allowedFileTypes = DEFAULT_TYPES,
}) => {
  const { toast } = useToast();
  const { uploadFiles, isLoading } = useFileStorage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (selectedFiles.length + files.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `You can only upload a maximum of ${maxFiles} files at once.`,
        variant: 'destructive',
      });
      return;
    }

    const accepted: File[] = [];
    Array.from(files).forEach((file) => {
      if (!allowedFileTypes.includes(file.type)) {
        toast({
          title: 'Unsupported file type',
          description: `${file.name} is not an allowed file type.`,
          variant: 'destructive',
        });
        return;
      }
      accepted.push(file);
    });

    setSelectedFiles((prev) => [...prev, ...accepted]);
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({ title: 'No files selected', description: 'Choose at least one file to upload.', variant: 'destructive' });
      return;
    }

    const results = await uploadFiles(selectedFiles);
    const succeeded = results.filter(Boolean).length;

    if (succeeded > 0) {
      toast({ title: 'Upload complete', description: `${succeeded} of ${selectedFiles.length} file(s) uploaded.` });
      setSelectedFiles([]);
      onUploadComplete?.();
    } else {
      toast({ title: 'Upload failed', description: 'No files could be uploaded. Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="hidden"
          id="document-upload-input"
          accept={allowedFileTypes.join(',')}
          disabled={isLoading}
        />
        <label htmlFor="document-upload-input" className="cursor-pointer block">
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium text-primary">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-muted-foreground">Images, PDFs, and Word documents (max {maxFiles} files)</p>
          </div>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected files</h4>
          <ul className="space-y-1">
            {selectedFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between text-sm border rounded-md px-3 py-2"
              >
                <span className="truncate">{file.name}</span>
                <button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`}>
                  <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleUpload} disabled={isLoading || selectedFiles.length === 0}>
          {isLoading ? (
            <>
              <Spinner className="mr-2" /> Uploading...
            </>
          ) : (
            'Upload'
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;
