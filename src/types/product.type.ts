export type ProductImages = {
  firstImg?: string | null;
  secondImg?: string | null;
  thirdImg?: string  | null;
};

export type Product = {
  id: number | string;
  name: string;
  sku: string;
  category: string;
  category_ID: string;
  price: number;
  status: string;
  added: string;
  description: string;
  ImageSrc: ProductImages;
  discountType?: string;
  discountValue?: number;
  taxClass?: string;
  vatAmount?: number;
  barcode: string;
  quantity: number;
  variants?: string;
  stock: number;
};
