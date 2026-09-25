import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadImage = useCallback(async (
    file: File,
    propertyId: string,
    orderIndex: number = 0,
    isPrimary: boolean = false
  ) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      return { success: false, error: 'Imagem deve ter no máximo 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Apenas imagens JPG, PNG ou WebP são permitidas' };
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      // Save to database
      const { data: imageData, error: dbError } = await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          url: publicUrl,
          storage_path: filePath,
          order_index: orderIndex,
          is_primary: isPrimary,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setProgress(100);
      return { success: true, data: imageData };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadMultiple = useCallback(async (
    files: File[],
    propertyId: string,
    startIndex: number = 0
  ) => {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const result = await uploadImage(files[i], propertyId, startIndex + i, i === 0 && startIndex === 0);
      results.push(result);
      if (!result.success) break;
    }
    return results;
  }, [uploadImage]);

  const deleteImage = useCallback(async (imageId: string, storagePath?: string) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      // Delete from storage if path provided
      if (storagePath) {
        await supabase.storage.from('property-images').remove([storagePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File, userId: string) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return { success: false, error: 'Avatar deve ter no máximo 2MB' };
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (dbError) throw dbError;

      return { success: true, url: publicUrl };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploading,
    error,
    progress,
    uploadImage,
    uploadMultiple,
    deleteImage,
    uploadAvatar,
  };
}
