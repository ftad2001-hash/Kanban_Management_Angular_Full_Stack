import {
  Directive, ElementRef, forwardRef,
  AfterViewInit, OnDestroy, input, output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';

@Directive({
  selector: '[appFlatpickr]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlatpickrDirective),
      multi: true,
    },
  ],
})
export class FlatpickrDirective implements ControlValueAccessor, AfterViewInit, OnDestroy {
  readonly minDate = input<string>('today');

  private fp: Instance | null = null;
  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    this.fp = flatpickr(this.el.nativeElement, {
      dateFormat: 'Y-m-d',
      minDate: this.minDate(),
      allowInput: true,
      onChange: (_, dateStr) => {
        this.onChange(dateStr);
        this.onTouched();
      },
    }) as Instance;
  }

  ngOnDestroy(): void {
    this.fp?.destroy();
  }

  writeValue(value: string | null): void {
    if (this.fp) {
      this.fp.setDate(value ?? '', false);
    } else {
      this.el.nativeElement.value = value ?? '';
    }
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.el.nativeElement.disabled = disabled;
  }
}
