
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'parserorder' })
export class ParserOrderPipe implements PipeTransform {
    transform(stateOrder: String) {
        if (stateOrder === 'ordered') return 'Đã đặt hàng';
        if (stateOrder === 'not-ordered') return 'Chưa đặt hàng';
        if (stateOrder === 'delivered') return 'Đang giao hàng';
        if (stateOrder === 'completed') return 'Đã giao hàng thành công';
        return '';
    }
}
