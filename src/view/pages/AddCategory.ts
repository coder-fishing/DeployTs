import { breadCrumbs } from '~/view/components/breadCrumb';
import { BUTTON_GROUPS } from '~/constant';
import { groupButton } from '~/view/components/groupButton';
import { BREADCRUMBS } from '~/constant';
import { categoryForm } from '~/view/components/form/categoryForm';
import { CategoryController } from '../../controllers/CategoryController';

const categoryController = CategoryController.getInstance();

export const AddCategory = (): string => {
    // Setup image handling after DOM is ready
    setTimeout(() => {
        categoryController.initializeImageHandling();
        categoryController.handleAddCategory()
    }, 100);

    return `
    <div class="product-list">
        <div class="product-title">
            <div class="product-title-left">
                <p class="product-title-left__name">Category</p>
                ${breadCrumbs(
                    BREADCRUMBS.ADD_CATEGORY.items,
                    BREADCRUMBS.PRODUCT_LIST.icon
                )}
            </div>   
                ${groupButton(BUTTON_GROUPS.FORM.CATEGORY)} 
        </div>
        ${categoryForm({
            categoryData: {} as any,
            mode: 'add'
        })}
    </div>
    `
}