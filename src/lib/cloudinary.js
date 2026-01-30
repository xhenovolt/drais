/**
 * =====================================================================
 * DRAIS Cloudinary Integration Module v2.0.0
 * =====================================================================
 * Handles image uploads, validation, and profile photo management
 * Works with or without Cloudinary credentials (graceful degradation)
 * =====================================================================
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// =====================================================================
// CLOUDINARY CONFIGURATION
// =====================================================================

let cloudinaryConfigured = false;

export function initCloudinary() {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.log('⚠️  Cloudinary credentials not configured');
      console.log('   Add to .env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
      return false;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    cloudinaryConfigured = true;
    console.log('✅ Cloudinary configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to configure Cloudinary:', error.message);
    return false;
  }
}

// =====================================================================
// IMAGE VALIDATION
// =====================================================================

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function validateImageFile(file) {
  try {
    // Check mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid image type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
      };
    }

    // Check if file can be read
    const buffer = await file.arrayBuffer();
    if (buffer.byteLength === 0) {
      return {
        valid: false,
        error: 'File is empty',
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `File validation error: ${error.message}`,
    };
  }
}

export async function validateImageUrl(url) {
  try {
    // Check URL format
    const urlObj = new URL(url);

    // Check if URL is accessible
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      return {
        valid: false,
        error: 'URL is not accessible',
      };
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !ALLOWED_MIME_TYPES.includes(contentType)) {
      return {
        valid: false,
        error: 'URL does not point to a valid image',
      };
    }

    // Check content length
    const contentLength = parseInt(response.headers.get('content-length'), 10);
    if (contentLength > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Image size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `URL validation error: ${error.message}`,
    };
  }
}

// =====================================================================
// FILE UPLOAD (CLOUDINARY)
// =====================================================================

export async function uploadProfilePhoto(file, userId, photoType = 'profile') {
  if (!cloudinaryConfigured) {
    return {
      success: false,
      error: 'Cloudinary not configured. Add credentials to .env',
    };
  }

  try {
    // Validate file first
    const validation = await validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const bufferStream = Buffer.from(buffer);

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `drais/profiles/${photoType}`,
          public_id: `${userId}_${photoType}_${Date.now()}`,
          resource_type: 'auto',
          quality: 'auto',
          format: 'webp',
          transformation: [
            {
              width: 500,
              height: 500,
              crop: 'fill',
              gravity: 'face',
              quality: 'auto',
            },
          ],
        },
        (error, result) => {
          if (error) {
            resolve({
              success: false,
              error: `Upload failed: ${error.message}`,
            });
          } else {
            resolve({
              success: true,
              url: result.secure_url,
              publicId: result.public_id,
              cloudinaryId: result.public_id,
              size: result.bytes,
              format: result.format,
            });
          }
        }
      );

      uploadStream.end(bufferStream);
    });
  } catch (error) {
    return {
      success: false,
      error: `Upload error: ${error.message}`,
    };
  }
}

export async function uploadCoverPhoto(file, userId) {
  if (!cloudinaryConfigured) {
    return {
      success: false,
      error: 'Cloudinary not configured. Add credentials to .env',
    };
  }

  try {
    const validation = await validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const buffer = await file.arrayBuffer();
    const bufferStream = Buffer.from(buffer);

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'drais/profiles/cover',
          public_id: `${userId}_cover_${Date.now()}`,
          resource_type: 'auto',
          quality: 'auto',
          format: 'webp',
          transformation: [
            {
              width: 1200,
              height: 400,
              crop: 'fill',
              quality: 'auto',
            },
          ],
        },
        (error, result) => {
          if (error) {
            resolve({
              success: false,
              error: `Upload failed: ${error.message}`,
            });
          } else {
            resolve({
              success: true,
              url: result.secure_url,
              publicId: result.public_id,
              cloudinaryId: result.public_id,
              size: result.bytes,
              format: result.format,
            });
          }
        }
      );

      uploadStream.end(bufferStream);
    });
  } catch (error) {
    return {
      success: false,
      error: `Upload error: ${error.message}`,
    };
  }
}

// =====================================================================
// IMAGE DELETION
// =====================================================================

export async function deleteImage(cloudinaryId) {
  if (!cloudinaryConfigured) {
    return { success: false, error: 'Cloudinary not configured' };
  }

  try {
    const result = await cloudinary.uploader.destroy(cloudinaryId);
    return {
      success: result.result === 'ok',
      message: result.result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Deletion error: ${error.message}`,
    };
  }
}

// =====================================================================
// IMAGE PREVIEW & URL HANDLING
// =====================================================================

export function generateThumbnailUrl(imageUrl, width = 200, height = 200) {
  if (!imageUrl) return null;

  // If it's a Cloudinary URL, apply transformations
  if (imageUrl.includes('res.cloudinary.com')) {
    return imageUrl.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto/`);
  }

  // For external URLs, return as is (no transformation possible)
  return imageUrl;
}

export function generateOptimizedUrl(imageUrl, options = {}) {
  if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) {
    return imageUrl;
  }

  const { width, height, quality = 'auto', format = 'webp' } = options;

  let transformations = `q_${quality}`;

  if (width && height) {
    transformations = `w_${width},h_${height},c_fill,${transformations}`;
  } else if (width) {
    transformations = `w_${width},${transformations}`;
  } else if (height) {
    transformations = `h_${height},${transformations}`;
  }

  return imageUrl.replace('/upload/', `/upload/${transformations},f_${format}/`);
}

// =====================================================================
// URL INPUT HANDLING
// =====================================================================

export async function processImageUrl(url, userId, photoType = 'profile') {
  try {
    // Validate URL
    const validation = await validateImageUrl(url);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // If Cloudinary configured, upload from URL
    if (cloudinaryConfigured) {
      try {
        const result = await cloudinary.uploader.upload(url, {
          folder: `drais/profiles/${photoType}`,
          public_id: `${userId}_${photoType}_${Date.now()}`,
          resource_type: 'auto',
          quality: 'auto',
          format: 'webp',
        });

        return {
          success: true,
          url: result.secure_url,
          cloudinaryId: result.public_id,
          source: 'cloudinary',
        };
      } catch (error) {
        return {
          success: false,
          error: `Failed to upload to Cloudinary: ${error.message}`,
        };
      }
    }

    // Without Cloudinary, use URL directly (with local optimization)
    return {
      success: true,
      url,
      source: 'external',
      note: 'Image stored as external URL. Cloudinary not configured for full optimization.',
    };
  } catch (error) {
    return {
      success: false,
      error: `URL processing error: ${error.message}`,
    };
  }
}

// =====================================================================
// LOCAL FALLBACK (without Cloudinary)
// =====================================================================

export function getLocalUploadPath() {
  return process.env.UPLOAD_DIR || './public/uploads';
}

export async function saveImageLocally(file, userId, photoType = 'profile') {
  try {
    const uploadDir = getLocalUploadPath();

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `${userId}_${photoType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Save file
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));

    // Return URL
    const publicUrl = `/uploads/${filename}`;

    return {
      success: true,
      url: publicUrl,
      localPath: filepath,
      filename,
    };
  } catch (error) {
    return {
      success: false,
      error: `Local save error: ${error.message}`,
    };
  }
}

// =====================================================================
// PROFILE PHOTO SERVICE
// =====================================================================

export async function updateProfilePhoto(userId, input, inputType = 'file') {
  /**
   * inputType can be: 'file' | 'url'
   * file: File object from form upload
   * url: String URL to image
   */

  try {
    if (inputType === 'file') {
      // Upload file
      if (cloudinaryConfigured) {
        return await uploadProfilePhoto(input, userId, 'profile');
      } else {
        return await saveImageLocally(input, userId, 'profile');
      }
    }

    if (inputType === 'url') {
      // Process URL
      return await processImageUrl(input, userId, 'profile');
    }

    return { success: false, error: 'Invalid input type' };
  } catch (error) {
    return {
      success: false,
      error: `Profile photo update error: ${error.message}`,
    };
  }
}

export async function updateCoverPhoto(userId, input, inputType = 'file') {
  try {
    if (inputType === 'file') {
      if (cloudinaryConfigured) {
        return await uploadCoverPhoto(input, userId);
      } else {
        return await saveImageLocally(input, userId, 'cover');
      }
    }

    if (inputType === 'url') {
      return await processImageUrl(input, userId, 'cover');
    }

    return { success: false, error: 'Invalid input type' };
  } catch (error) {
    return {
      success: false,
      error: `Cover photo update error: ${error.message}`,
    };
  }
}

// =====================================================================
// BATCH OPERATIONS
// =====================================================================

export async function deleteUserImages(userId, cloudinaryIds) {
  if (!cloudinaryConfigured) {
    return { success: true, deleted: 0, note: 'Cloudinary not configured' };
  }

  try {
    let deleted = 0;

    for (const id of cloudinaryIds) {
      try {
        const result = await cloudinary.uploader.destroy(id);
        if (result.result === 'ok') {
          deleted++;
        }
      } catch (error) {
        console.error(`Failed to delete ${id}:`, error.message);
      }
    }

    return { success: true, deleted };
  } catch (error) {
    return {
      success: false,
      error: `Batch delete error: ${error.message}`,
    };
  }
}

// =====================================================================
// STATUS AND INFO
// =====================================================================

export function getCloudinaryStatus() {
  return {
    configured: cloudinaryConfigured,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? '✓' : '✗',
    apiKey: process.env.CLOUDINARY_API_KEY ? '✓' : '✗',
    apiSecret: process.env.CLOUDINARY_API_SECRET ? '✓' : '✗',
    message: cloudinaryConfigured
      ? 'Cloudinary ready for image uploads'
      : 'Cloudinary not configured. Images will be stored locally or as URLs',
  };
}

// =====================================================================
// EXPORT
// =====================================================================

export default {
  initCloudinary,
  validateImageFile,
  validateImageUrl,
  uploadProfilePhoto,
  uploadCoverPhoto,
  deleteImage,
  generateThumbnailUrl,
  generateOptimizedUrl,
  processImageUrl,
  saveImageLocally,
  updateProfilePhoto,
  updateCoverPhoto,
  deleteUserImages,
  getCloudinaryStatus,
};
