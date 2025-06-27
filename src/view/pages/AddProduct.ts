import { breadCrumbs } from '~/view/components/breadCrumb';
import { BUTTON_GROUPS } from '~/constant';
import { groupButton } from '~/view/components/groupButton';
import { BREADCRUMBS } from '~/constant';

import { productForm } from '~/view/components/form/prodcutForm';
export const AddProduct = (): string => {
    return `
    <div class="product-list">
            <div class="product-title">
                <div class="product-title-left">
                    <p class="product-title-left__name">Product</p>
                    ${breadCrumbs(
                        BREADCRUMBS.ADD_PRODUCT.items,
                        BREADCRUMBS.PRODUCT_LIST.icon
                    )}
                </div>   
                    ${groupButton(BUTTON_GROUPS.FORM)} 
            </div>
            ${productForm({
                productData: {},
                mode: 'add',})}

        </div>
    `
}