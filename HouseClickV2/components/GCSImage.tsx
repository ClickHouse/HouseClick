'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSignedImageUrl } from '@/app/actions/imageActions';

interface GcsImageProps {
    filename: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
}

export default function GcsImage({
    filename,
    alt,
    width,
    height,
    className,
    priority = false,
}: GcsImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchImageUrl() {
            try {
                setIsLoading(true);
                const result = await getSignedImageUrl(filename);
                setImageUrl(result.url);
            } catch (err) {
                console.error('Error fetching image URL:', err);
                setError(err instanceof Error ? err.message : 'Failed to load image');
            } finally {
                setIsLoading(false);
            }
        }

        fetchImageUrl();
    }, [filename]);

    if (error) {
        return <div className="image-error">Error: {error}</div>;
    }

    if (isLoading || !imageUrl) {
        return <div className="image-loading">Loading...</div>;
    }

    return (
        <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            className={className}
            priority={priority}
        />
    );
}
