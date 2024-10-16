export interface TableColumn<T> {
  key: keyof T;
  label: string;
  pipe?: string;
}
