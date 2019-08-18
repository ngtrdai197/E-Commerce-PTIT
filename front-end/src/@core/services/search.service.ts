import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API } from '../config/API';
import { IProduct } from '../interface';
import { IOrder } from '../interface/IOrder.interface';

@Injectable({ providedIn: 'root' })

export class SearchService {
    constructor(private http: HttpClient) { }

    search(keyword: string, sort: number, sex: number, pagination: any): Observable<IProduct[] | any> {
        const query = `keyword=${keyword}&sort=${sort}&sex=${sex}&page=${pagination.page}&perPage=${pagination.perPage}`;
        return this.http.get<IProduct[] | any>(`${API.HOST}/${API.SEARCH.BASE}?${query}`).pipe(
            tap(data => {
                return data.products.map(p => {
                    return p.images = p.images.map(i => {
                        return `${API.HOST}/${i}`;
                    });
                })
            }));
    }

    searchWithOrder(keyword: string, date: string, tomorrow: string, stateOrder: string): Observable<IOrder[]> {
        return this.http.get<IOrder[]>(`${API.HOST}/${API.ORDER.BASE}/search?keyword=${keyword}&date=${date}&tomorrow=${tomorrow}&stateOrder=${stateOrder}`);
    }
}