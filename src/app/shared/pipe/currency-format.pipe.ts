import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appCurrency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {
  transform(value: any, currency: string = 'USD'): string {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
      }).format(value);
    }
    return value.toString();
  }
}
