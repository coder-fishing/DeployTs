class CategoryUIHandler {
    private eventListenersInitialized: boolean;

    constructor() {
        this.eventListenersInitialized = false;
    }

    updateUIState(
        emptyState: HTMLElement | null,
        previewState: HTMLElement | null,
        show: boolean
    ): void {
        if (emptyState && previewState) {
            emptyState.style.display = show ? 'none' : 'flex';
            previewState.style.display = show ? 'block' : 'none';
        }
    }

    setButtonLoading(
        button: HTMLButtonElement | null,
        isLoading: boolean,
        text: string = 'Add Category'
    ): void {
        if (button) {
            button.disabled = isLoading;
            const buttonText = button.querySelector('.button__text') as HTMLElement | null;
            if (buttonText) {
                buttonText.textContent = isLoading ? 'Processing...' : text;
            }
        }
    }

    setupImageHandling(elements: {
        emptyState: HTMLElement | null;
        previewState: HTMLElement | null;
        imageInput: HTMLInputElement | null;
        previewImage: HTMLImageElement | null;
        uploadArea: HTMLElement | null;
    }): void {
        const {
            emptyState,
            previewState,
            imageInput,
            previewImage,
            uploadArea
        } = elements;

        if (!imageInput || !previewImage) {
            console.error('Required image elements not found');
            return;
        }

        console.log('Setting up image handling in CategoryUIHandler');

        const handleImageUpload = async (file: File): Promise<void> => {
            if (!file) return;

            try {
                console.log('Handling image upload in CategoryUIHandler');
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    if (previewImage && e.target?.result) {
                        previewImage.src = e.target.result as string;
                        console.log('Image preview updated');
                    }
                };
                reader.readAsDataURL(file);

                this.updateUIState(emptyState, previewState, true);
            } catch (error) {
                console.error('Error handling image:', error);
                alert('Error handling image. Please try again.');
            }
        };

        imageInput.onchange = (e: Event) => {
            console.log('Image input change detected');
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                console.log('File selected:', file.name);
                handleImageUpload(file);
            }
        };

        if (uploadArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, (e: Event) => {
                    const dragEvent = e as DragEvent;
                    dragEvent.preventDefault();
                    dragEvent.stopPropagation();
                    console.log(`Drag event: ${eventName}`);
                });
            });

            uploadArea.addEventListener('drop', (e: DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('File dropped on upload area');
                const file = e.dataTransfer?.files?.[0];
                if (file && file.type.startsWith('image/')) {
                    console.log('Image file dropped:', file.name);
                    handleImageUpload(file);
                    if (imageInput) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        imageInput.files = dataTransfer.files;
                    }
                }
            });
        }

        const removeButton = document.querySelector('.thumbnail__preview-remove') as HTMLButtonElement | null;
        if (removeButton) {
            removeButton.onclick = () => {
                console.log('Remove image button clicked');
                if (imageInput) {
                    imageInput.value = '';
                }
                if (previewImage) {
                    previewImage.src = '';
                }
                this.updateUIState(emptyState, previewState, false);
            };
        }
    }
}

export default CategoryUIHandler;
