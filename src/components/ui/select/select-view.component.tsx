import {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Content,
  Viewport,
  Item,
  ItemText,
  ItemIndicator,
  ScrollUpButton,
  ScrollDownButton,
} from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { ISelectViewProps } from './select.types';

export const SelectView = ({
  selectedLabel,
  id,
  label,
  value,
  options,
  onValueChange,
  disabled,
  describedBy,
}: ISelectViewProps) => (
  <Root value={value} onValueChange={onValueChange} disabled={disabled}>
    <Trigger
      id={id}
      aria-label={label}
      aria-describedby={describedBy}
      className="group inline-flex min-h-11 w-44 max-w-full shrink-0 cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 text-left text-xs font-medium text-text-primary transition-colors hover:border-accent/60 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-accent motion-reduce:transition-none"
    >
      <span className="truncate">
        <Value>{selectedLabel}</Value>
      </span>
      <Icon asChild>
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.75}
          className="size-4 shrink-0 text-accent transition-transform duration-150 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
        />
      </Icon>
    </Trigger>
    <Portal>
      <Content
        position="popper"
        align="start"
        sideOffset={8}
        collisionPadding={16}
        className="z-70 max-h-[min(20rem,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-editorial"
      >
        <ScrollUpButton className="flex h-7 items-center justify-center text-accent">
          <ChevronUp aria-hidden="true" strokeWidth={1.75} className="size-4" />
        </ScrollUpButton>
        <Viewport>
          {options.map((option) => (
            <Item
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="relative flex min-h-11 cursor-pointer items-center rounded-lg py-2 pr-3 pl-9 text-xs text-text-primary outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-40 data-highlighted:bg-primary-soft data-highlighted:text-text-primary data-[state=checked]:font-semibold"
            >
              <ItemIndicator className="absolute left-3 text-accent">
                <Check aria-hidden="true" strokeWidth={1.75} className="size-4" />
              </ItemIndicator>
              <ItemText>{option.label}</ItemText>
            </Item>
          ))}
        </Viewport>
        <ScrollDownButton className="flex h-7 items-center justify-center text-accent">
          <ChevronDown aria-hidden="true" strokeWidth={1.75} className="size-4" />
        </ScrollDownButton>
      </Content>
    </Portal>
  </Root>
);
