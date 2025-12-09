import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, X, Loader2, Image, Music, Video } from 'lucide-react';

interface FileUploadProps {
  bucket: 'sermons' | 'events' | 'blog';
  accept?: string;
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
  label?: string;
  type?: 'image' | 'audio' | 'video';
}

export function FileUpload({ 
  bucket, 
  accept = 'image/*', 
  onUploadComplete, 
  currentUrl,
  label = 'Upload File',
  type = 'image'
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getIcon = () => {
    switch (type) {
      case 'audio': return Music;
      case 'video': return Video;
      default: return Image;
    }
  };

  const Icon = getIcon();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUploadComplete(publicUrl);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {preview ? (
        <div className="relative">
          {type === 'image' ? (
            <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : type === 'video' ? (
            <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
              <video src={preview} controls className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="relative rounded-lg bg-muted p-4">
              <audio src={preview} controls className="w-full" />
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium">Click to upload</span>
              <span className="text-sm text-muted-foreground">or drag and drop</span>
            </div>
          )}
        </div>
      )}

      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />

      {!preview && (
        <p className="text-xs text-muted-foreground">
          Max file size: 50MB. {type === 'image' ? 'Supported formats: JPG, PNG, GIF, WebP' : type === 'video' ? 'Supported formats: MP4, WebM' : 'Supported formats: MP3, WAV, M4A'}
        </p>
      )}
    </div>
  );
}
