import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from 'src/@core/interface/IProduct.interface';
import { Observable, Observer } from 'rxjs';
import { API } from 'src/@core/config/API';

@Injectable({
    providedIn: "root"
})
export class ProductService {

    constructor(private http: HttpClient) { }

    fetchProductsByCategory(categoryId: string): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${API.HOST}/${API.PRODUCT.BASE}/${API.PRODUCT.GET_BY_CATEGORY}/${categoryId}`);
    }

    createProduct(product: IProduct): Observable<IProduct> {
        return this.http.post<IProduct>(`${API.HOST}/${API.PRODUCT.BASE}`, product);
    }

    unLinkImage(unlink: any): Observable<any> {
        return this.http.post<any>(`${API.HOST}/${API.PRODUCT.BASE}/${API.PRODUCT.UNLINK}`, unlink);
    }

    updateProduct(product: FormData): Observable<IProduct> {
        return this.http.put<IProduct>(`${API.HOST}/${API.PRODUCT.BASE}`, product);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete<any>(`${API.HOST}/${API.PRODUCT.BASE}/${id}`);
    }
}