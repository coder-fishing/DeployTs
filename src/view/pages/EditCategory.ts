import { breadCrumbs } from '~/view/components/breadCrumb';
import { BUTTON_GROUPS } from '~/constant';
import { groupButton } from '~/view/components/groupButton';
import { BREADCRUMBS } from '~/constant';
import { categoryForm } from '~/view/components/form/categoryForm';
import { CategoryController } from '../../controllers/CategoryController';

const categoryController = CategoryController.getInstance();

export const EditCategory = (params?: { id: string }): string => {
    const categoryId = params?.id;
    
    // Setup image handling và button event listeners after DOM is ready
    setTimeout(async () => {
        console.log('🚀 Setting up Edit Category page for ID:', categoryId);
        categoryController.initializeImageHandling();
        categoryController.setupSaveCategoryButton();
        
        // Load category data if ID is provided
        if (categoryId) {
            try {
                const category = await categoryController.getCategoryById(parseInt(categoryId));
                console.log('📋 Loaded category data:', category);
                
                // Populate form with category data
                const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
                const descriptionInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
                
                if (nameInput && category.name) {
                    nameInput.value = category.name;
                }
                if (descriptionInput && category.description) {
                    descriptionInput.value = category.description;
                }
                
                // Handle image preview if category has image
                if (category.image) {
                    const emptyState = document.getElementById('emptyState');
                    const previewState = document.getElementById('previewState');
                    const previewImage = document.getElementById('previewImage') as HTMLImageElement;
                    
                    if (emptyState && previewState && previewImage) {
                        emptyState.style.display = 'none';
                        previewState.style.display = 'block';
                        previewImage.src = category.image;
                    }
                }
                
                // Store original form data for change detection
                setTimeout(() => {
                    categoryController.storeOriginalFormData();
                }, 200);
                
            } catch (error) {
                console.error('❌ Error loading category:', error);
                alert('Failed to load category data');
            }
        }
    }, 100);

    return `
    <div class="product-list">
        <div class="product-title">
            <div class="product-title-left">
                <p class="product-title-left__name">Edit Category </p>
                ${breadCrumbs(
                    BREADCRUMBS.ADD_CATEGORY.items,
                    BREADCRUMBS.PRODUCT_LIST.icon
                )}
            </div>   
                ${groupButton(BUTTON_GROUPS.FORM.CATEGORY)} 
        </div>
        ${categoryForm({
            categoryData: { categoryID: categoryId } as any,
            mode: 'edit'
        })}
    </div>
    `
}