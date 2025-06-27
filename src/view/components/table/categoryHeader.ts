import { caretDown, minus, checkbox } from "~/assets/icon";
import { createHeaderCell } from "~/utils/createHeaderCell";

export const CategoryHeader = (): string => {
  return `
        <thead>
  <tr>
    <th class="product-table-header">
      <div class="product-table-header__wrapper three">
        <div class="product-table-header__image">
          <div class="product-table-header__imageleft">
            <img class="product-table-header__imageleft--first" src="${checkbox}" alt="checkbox"/>
            <img class="product-table-header__imageleft--second" src="${minus}" alt="tick"/>
          </div>
          <p class="product-table-header__name translate">Category</p>
        </div>
        <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
      </div>
    </th>
    ${createHeaderCell("Sold", true)}
    ${createHeaderCell("Stock", true)}
    ${createHeaderCell("Added", true)}
    ${createHeaderCell("Action")}
  </tr>
        </thead>
    `;
};
