/**
 * Image compression utility
 */

export interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeKB?: number;
}

export const compressImage = (file: File, options: CompressionOptions = {}): Promise<File> => {
    return new Promise((resolve, reject) => {
        const {
            maxWidth = 1024,
            maxHeight = 1024,
            quality = 0.8,
            maxSizeKB = 500
        } = options;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }

            // Set canvas size
            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx!.drawImage(img, 0, 0, width, height);
            
            // Convert to blob with compression
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Failed to compress image'));
                    return;
                }

                // Check if size is acceptable
                const sizeKB = blob.size / 1024;
                console.log(`🖼️ Compressed image: ${file.name} - ${sizeKB.toFixed(2)}KB`);

                if (sizeKB > maxSizeKB) {
                    console.warn(`⚠️ Image still too large: ${sizeKB.toFixed(2)}KB > ${maxSizeKB}KB`);
                    
                    // Try with lower quality
                    const lowerQuality = Math.max(0.1, quality - 0.2);
                    console.log(`🔄 Retrying with quality: ${lowerQuality}`);
                    
                    canvas.toBlob((retryBlob) => {
                        if (!retryBlob) {
                            reject(new Error('Failed to compress image with lower quality'));
                            return;
                        }
                        
                        const compressedFile = new File([retryBlob], file.name, {
                            type: blob.type,
                            lastModified: Date.now()
                        });
                        
                        resolve(compressedFile);
                    }, blob.type, lowerQuality);
                } else {
                    const compressedFile = new File([blob], file.name, {
                        type: blob.type,
                        lastModified: Date.now()
                    });
                    
                    resolve(compressedFile);
                }
            }, file.type, quality);
        };

        img.onerror = () => {
            reject(new Error('Failed to load image for compression'));
        };

        img.src = URL.createObjectURL(file);
    });
};

export const compressMultipleImages = async (files: File[], options: CompressionOptions = {}): Promise<File[]> => {
    const compressedFiles: File[] = [];
    
    for (const file of files) {
        try {
            const compressed = await compressImage(file, options);
            compressedFiles.push(compressed);
        } catch (error) {
            console.error(`❌ Failed to compress ${file.name}:`, error);
            // Use original file if compression fails
            compressedFiles.push(file);
        }
    }
    
    return compressedFiles;
};
