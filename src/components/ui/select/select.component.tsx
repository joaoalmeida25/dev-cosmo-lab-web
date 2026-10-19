'use client';

import { SelectView } from './select-view.component';
import type { ISelectProps } from './select.types';

export const Select = <T extends string>({ onValueChange, options, ...props }: ISelectProps<T>) => {
  const selectOption = (value: string) => {
    const option = options.find((candidate) => candidate.value === value);

    if (option && !option.disabled) {
      onValueChange(option.value);
    }
  };

  return (
    <SelectView
      selectedLabel={options.find((option) => option.value === props.value)?.label ?? props.value}
      {...props}
      options={options}
      onValueChange={selectOption}
    />
  );
};
