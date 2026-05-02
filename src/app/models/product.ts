export interface IProduct {
  id: number;
  name: string;
  productCode: string;
  price: number;
  categoryId: number;
  category: string;
  imagePath: string;
  minimumQuantity: number;
  discountRate: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}