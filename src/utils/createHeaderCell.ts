import { caretDown } from "~/assets/icon";
export const createHeaderCell = (title: string, hasSort = false) => `
    <th class="product-table-header">
        <div class="product-table-header__wrapper${hasSort ? " two" : ""}">
            <p class="product-table-header__name">${title}</p>
            ${
              hasSort
                ? `<img src="${caretDown}" alt="arrow Down" class="product-title__icon" />`
                : ""
            }
        </div>
    </th>
`;
