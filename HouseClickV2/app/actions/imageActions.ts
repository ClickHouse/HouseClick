'use server'

import { Storage } from '@google-cloud/storage';

interface SignedUrlResult {
  url: string;
  expiry: number;
}

export async function getSignedImageUrl(filename: string): Promise<SignedUrlResult> {
  try {
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
    
    return { 
      url: signedUrl,
      expiry: expiryTime
    };
    
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
}
