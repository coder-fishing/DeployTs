import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET  } from '../config/cloudary.config';
import axios from "axios";

const uploadToCloudinary = async(file: File) => {
    if (!CLOUDINARY_UPLOAD_PRESET) {
        throw new Error('Cloudinary upload preset is not configured');
    }

    if (!CLOUDINARY_UPLOAD_URL) {
        throw new Error('Cloudinary upload URL is not configured');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
        return response.data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload image');
    }
}

export default uploadToCloudinary;