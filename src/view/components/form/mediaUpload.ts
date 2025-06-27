import { picture } from "~/assets/icon";

export interface MediaUploadProps {
  images?: {
    firstImg?: string | null;
    secondImg?: string | null;
    thirdImg?: string | null;
  };
  mode: 'add' | 'edit';
}

export const MediaUpload = ({ images, mode }: MediaUploadProps): string => {
  const hasImages = Boolean(mode === 'edit' && images?.firstImg);
  
  return `
    <div class="form-section__field">  
      <p class="form-section__field--name">Photo</p> 
      ${EmptyUploadState(!hasImages)}
      ${FilledUploadState(hasImages, images)}
    </div>
  `;
};

const EmptyUploadState = (show: boolean): string => `
  <div class="media__upload-area upload-empty" id="emptyState" style="display: ${show ? 'flex' : 'none'}">
    <figure class="media__upload-area--figure" id="productImageArea">
      <img src="${picture}" alt="product-image" class="media__upload-area--img" id="productImage">
    </figure>
    <p class="media__upload-text">Drag and drop image here, or click add image</p>
    <input type="file" id="imageInputEmpty" accept="image/*" style="display: none;">
    <button class="media__upload-btn" type="button" onclick="document.getElementById('imageInputEmpty').click(); return false;">Add Image</button>
  </div>
`;

const FilledUploadState = (show: boolean, images?: any): string => `
  <div class="media__upload-area upload-filled" id="filledState" style="display: ${show ? 'flex' : 'none'}">
    <div class="media_upload-area list-image">
      ${ImagePreview(images?.firstImg, 0)}
      ${ImagePreview(images?.secondImg, 1)}
      ${ImagePreview(images?.thirdImg, 2)}
    </div> 
    <p class="media__upload-text">Drag and drop image here, or click add image</p>
    <input type="file" id="imageInputFilled" accept="image/*" style="display: none;">
    <button class="media__upload-btn" type="button" onclick="document.getElementById('imageInputFilled').click(); return false;">Add Image</button>
  </div>
`;

const ImagePreview = (src?: string, index?: number): string => {
  if (!src) return '';
  const shouldShow = index === 0 ? true : src.includes('cloudinary');
  
  return `
    <figure class="list-image-preview" style="display: ${shouldShow ? 'block' : 'none'}">
      <img src="${src}" alt="product-image" class="preview-img" ${index === 0 ? 'id="previewImg"' : ''}>
      <div class="delete-image" data-index="${index}">×</div>
    </figure>
  `;
};
