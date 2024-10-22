import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'appDateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any, options: { year: 'numeric' | '2-digit', month: 'numeric' | '2-digit', day: 'numeric' | '2-digit', hour: 'numeric' | '2-digit', minute: 'numeric' | '2-digit', second: 'numeric' | '2-digit' }
    = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }
  ): string {
    return new Intl.DateTimeFormat('en-US', options).format(new Date(value));
  }
}
