export interface SelectionOption<T> {
  icon?: string;
  text: T | string | number;
  value: T;
}
