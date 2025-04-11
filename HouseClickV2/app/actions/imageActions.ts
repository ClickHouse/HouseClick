'use server'

import { Storage } from '@google-cloud/storage';

interface SignedUrlResult {
  url: string;
  expiry: number;
}

// Server-side cache
const urlCache = new Map<string, SignedUrlResult>();

export async function getSignedImageUrl(filename: string): Promise<SignedUrlResult> {
  try {

    // Check server-side cache first
    const cached = urlCache.get(filename);
    const now = Date.now();
    
    // Use cached URL if it exists and not close to expiring (with 1-minute buffer)
    if (cached && cached.expiry > now) {
        return cached;
    }
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || '{}'),
    });
    
    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('Bucket name not configured');
    }

    const bucket = storage.bucket(bucketName);
    const file = bucket.file('houseclick' + filename);
    
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error('File not found');
    }

    // Set the expiry time to 15 minutes from now
    const expiryTime = Date.now() + 15 * 60 * 1000;
    
    // Generate signed URL
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: expiryTime,
    });

    const result = { 
        url: signedUrl,
        expiry: expiryTime
    };
    
    // Update the server-side cache
    urlCache.set(filename, result);

    return result;

  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
}
