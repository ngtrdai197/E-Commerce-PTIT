import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API } from '../config/API';
import { IProduct } from '../interface';

@Injectable({ providedIn: 'root' })

export class SearchService {
    constructor(private http: HttpClient) { }

    search(keyword: string, sort: number, sex: number, pagination: any): Observable<IProduct[] | any> {
        return this.http.get<IProduct[] | any>(`${API.HOST}/${API.SEARCH.BASE}?keyword=${keyword}&sort=${sort}&sex=${sex}&page=${pagination.page}&perPage=${pagination.perPage}`).pipe(
            tap(data => {
                return data.products.map(p => {
                    return p.images = p.images.map(i => {
                        return `${API.HOST}/${i}`;
                    });
                })
            }));
    }
}