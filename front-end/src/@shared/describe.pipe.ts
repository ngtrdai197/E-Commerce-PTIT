
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'describe' })
export class DescriptionPipe implements PipeTransform {
    transform(description: String) {
        if (description.length > 50) {
            const result = description.substring(0, 50);
            return `${result} ...`;
        }
        return description;
    }
}
