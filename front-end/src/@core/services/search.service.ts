import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API } from '../config/API';
import { IProduct } from '../interface';

@Injectable({ providedIn: 'root' })

export class SearchService {
    constructor(private http: HttpClient) { }

    search(keyword: string): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${API.HOST}/${API.SEARCH.BASE}/${keyword}`).pipe(
            tap(products => {
                return products.map(p => {
                   return p.images = p.images.map(i => {
                        return `${API.HOST}/${i}`;
                    });
                })
            }));
    }
}