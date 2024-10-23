export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  type?: 'image' | 'button' | 'icon' | 'tooltip';
  pipe?: (value: any) => any;
}
