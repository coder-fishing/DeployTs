type PaginationProps = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  caretLeft: string; // icon path
};

export function Pagination({
  currentPage,
  itemsPerPage,
  totalItems,
  caretLeft,
}: PaginationProps): string {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return `
        <div class="pagination">
            <div class="pagination__showing">
                Showing ${start}-${end} from ${totalItems}
            </div>
            <div class="pagination__button">
                <div class="pagination__button-caret-left" id="prevbtn">
                    <figure class="image"><img src="${caretLeft}" alt="caret left" /></figure>
                </div>
                <div class="pagination__button-page-number" id="page-numbers"></div>
                <div class="pagination__button-caret-right" id="nextbtn">
                    <figure class="image"><img src="${caretLeft}" alt="caret right" /></figure>
                </div>
            </div>
        </div>
    `;
}
