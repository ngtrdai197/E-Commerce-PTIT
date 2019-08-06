
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'describe' })
export class DescriptionPipe implements PipeTransform {
    transform(description: String) {
        if (description.length > 30) {
            const result = description.substring(0, 30);
            return `${result} ...`;
        }
        return description;
    }
}
