export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName?: string;
  imageUrl?: string | null;
}
