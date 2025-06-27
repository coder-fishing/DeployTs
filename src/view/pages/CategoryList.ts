import { breadCrumbs } from "~/view/components/breadCrumb";
import { BUTTON_GROUPS } from "~/constant";
import { groupButton } from "~/view/components/groupButton";
import { BREADCRUMBS } from "~/constant";
import { searchBar } from "~/view/components/searchBar";
import { CategoryTable } from "~/view/components/table/categoryTable";

const categoys = [
  {
    sold: 40,
    stock: 11,
    description: "description 522",
    image: "https://avatars.githubusercontent.com/u/7373002",
    name: "name 52",
    create_at: 1743688039,
    categoryID: "52",
  },
  {
    sold: 23,
    stock: 74,
    description: "ăâêăâêăâêăâê",
    image:
      "https://res.cloudinary.com/dzivajta9/image/upload/v1743691172/qb5hmcxog0usjaggixpx.jpg",
    name: "ăâêăâêqq",
    create_at: 1743687994,
    categoryID: "53",
  },
  {
    sold: 74,
    stock: 81,
    description: "kk",
    image:
      "https://res.cloudinary.com/dzivajta9/image/upload/v1745681595/l6iikpjv7tjej640d3mn.jpg",
    name: "21313",
    create_at: 1745677997,
    categoryID: "60",
  },
  {
    sold: 7,
    stock: 41,
    description: "231233422423423455",
    image:
      "https://res.cloudinary.com/dzivajta9/image/upload/v1746555799/cnfiubzj5q3zoshnxd3n.png",
    name: "213123111",
    create_at: 1746552142,
    categoryID: "61",
  },
  {
    sold: 2,
    stock: 75,
    description: "122123kk;kk; gg",
    image:
      "https://res.cloudinary.com/dzivajta9/image/upload/v1746609236/tmsqjea1w8zq9q4ypfkb.png",
    name: "ádsadssssssssssssssssssssssss 1231233123123qewwadasdads1113!@@$@$11",
    create_at: 1746605519,
    categoryID: "62",
  },
  {
    sold: 53,
    stock: 34,
    description:
      "lkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfl",
    image:
      "https://res.cloudinary.com/dzivajta9/image/upload/v1746635991/imnerarf6pftjj0glpow.png",
    name: "lkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfllkklk;kkhlhkjhkjhlljslkdasjflkasjfl",
    create_at: 1746632155,
    categoryID: "64",
  },
];
export const CategoryList = (): string => {
  return `
            <div class="product-list">
                        <div class="product-title">
                            <div class="product-title-left">
                                <p class="product-title-left__name">Product</p>
                                ${breadCrumbs(
                                  BREADCRUMBS.CATEGORY_LIST.items,
                                  BREADCRUMBS.CATEGORY_LIST.icon
                                )}
                            </div>   
                            ${groupButton(BUTTON_GROUPS.LIST.CATEGORY)} 
                        </div>
                        <div class="tag-add-searchbar">
                            <div class="tag-add-searchbar-none"></div>
                            <div class="tag-add-searchbar__search">
                                ${searchBar("Search").outerHTML}
                            </div>
                        </div>
                        ${CategoryTable(categoys)}
                    </div>
                `;
}
