import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keyvalue' })
export class KeyValuePipe implements PipeTransform {
  transform(value: Map<any, any>): { key: any; value: any }[] {
    return Array.from(value.entries()).map(([key, value]) => ({ key, value }));
  }
}
