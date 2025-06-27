import { breadCrumbs } from '~/view/components/breadCrumb';
import { BUTTON_GROUPS } from '~/constant';
import { groupButton } from '~/view/components/groupButton';
import { BREADCRUMBS } from '~/constant';
import { TagFilter } from '~/view/components/tagFilter';
import { TAG_FILTERS } from '~/constant';

import { searchBar } from '~/view/components/searchBar';
import { ProductTable } from '~/view/components/table/productTable';
import { Pagination } from '~/view/components/pagination';
import { caretLeft } from '~/assets/icon';

let currentFilter = TAG_FILTERS.PRODUCT[0];
const tagFilterHtml = TagFilter(TAG_FILTERS.PRODUCT, currentFilter);

const paginationHtml = Pagination({
  currentPage: 1,
  itemsPerPage: 1,
  totalItems: 3,
  caretLeft,
});
const products = [
  {
    name: "123123",
    description: "123123123132",
    category_ID: "53",
    status: "Published",
    price: 11,
    discount_type: "discount_type 88",
    discount_value: 92,
    tax_class: "tax_class 88",
    vat_amount: 12,
    created_at: 1746275433,
    updated_at: 1746275433,
    sku: "123123",
    category: "ăâêăâêqq",
    quantity: 57,
    barcode: "123",
    id: "88",
    added: "2025-05-06T16:20:09.169Z",
    stock: 57,
    ImageSrc: {
      firstImg:
        "https://res.cloudinary.com/dzivajta9/image/upload/v1746557787/e66y1oivtquldmpmpunz.png",
      secondImg: null,
      thirdImg: null,
    },
  },
  {
    name: "123",
    description: "123",
    category_ID: "62",
    status: "Low Stock",
    price: 123123,
    discount_type: "fixed",
    discount_value: "123",
    tax_class: "tax_class_86",
    vat_amount: "123123",
    created_at: 1746275552,
    updated_at: 1746275552,
    sku: "11",
    category:
      "ádsadssssssssssssssssssssssss 1231233123123qewwadasdads1113!@@$@$11",
    quantity: 11,
    barcode: "11",
    id: "89",
    added: "2025-05-06T16:01:54.054Z",
    stock: 11,
    ImageSrc: {
      firstImg:
        "https://res.cloudinary.com/dzivajta9/image/upload/v1746280890/pgyarhdvrammeip2fs02.jpg",
      secondImg:
        "https://res.cloudinary.com/dzivajta9/image/upload/v1746547314/h57fsvohwkayodhdpkjj.jpg",
      thirdImg: null,
    },
  },
  {
    name: "hu",
    description: "",
    category_ID: "53",
    status: "Published",
    price: 213123,
    discount_type: "discount_type 90",
    discount_value: 41,
    tax_class: "tax_class 90",
    vat_amount: 85,
    created_at: 1746552128,
    updated_at: 1746552128,
    sku: "231",
    category: "ăâêăâêqq",
    quantity: 213123,
    barcode: "13123",
    id: "90",
    stock: 213123,
    added: "2025-05-06T18:52:06.551Z",
    ImageSrc: {
      firstImg:
        "https://res.cloudinary.com/dzivajta9/image/upload/v1746557525/swxung1tv04gje7d0bgk.png",
      secondImg: null,
      thirdImg: null,
    },
  }
];

export const ProducList = ():string => {
    return `
        <div class="product-list">
            <div class="product-title">
                <div class="product-title-left">
                    <p class="product-title-left__name">Product</p>
                    ${breadCrumbs(
                      BREADCRUMBS.PRODUCT_LIST.items,
                      BREADCRUMBS.PRODUCT_LIST.icon
                    )}
                </div>   
                ${groupButton(BUTTON_GROUPS.LIST.PRODUCT)} 
            </div>
            <div class="tag-add-searchbar">
                ${tagFilterHtml}
                <div class="tag-add-searchbar__search">
                    ${searchBar("Search").outerHTML}
                </div>
            </div>
            ${ProductTable(products)}   
             ${paginationHtml}
        </div>
    `;
} 