export interface ISelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface ISelectProps<T extends string> {
  id: string;
  label: string;
  value: T;
  options: ReadonlyArray<ISelectOption<T>>;
  onValueChange: (value: T) => void;
  disabled?: boolean;
  describedBy?: string;
}

export interface ISelectViewProps {
  selectedLabel: string;
  id: string;
  label: string;
  value: string;
  options: ReadonlyArray<ISelectOption>;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  describedBy?: string;
}
