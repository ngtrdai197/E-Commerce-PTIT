
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'subtitle' })
export class SubTitlePipe implements PipeTransform {
    transform(description: String) {
        if (description.length > 20) {
            const result = description.substring(0, 17);
            return `${result} ...`;
        }
        return description;
    }
}
