export interface TableColumn<T> {
  key: keyof T;
  label: string;
  type?: 'image' | 'button' | 'icon' | 'tooltip';
  pipe?: (value: any) => any;
}
