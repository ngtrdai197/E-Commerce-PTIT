import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from 'src/@core/interface/ICategory.interface';
import { API } from 'src/@core/config/API';
import { map } from 'rxjs/operators';
import { IProduct } from 'src/@core/interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  get listCategory() {
    return this.http.get<ICategory[]>(`${API.HOST}/${API.CATEGORY.BASE}`).pipe(map(x => {
      return x.filter(x => {
        return (x.products as IProduct[]).map(x => {
          x.images = x.images.map(img => {
            return img = `${API.HOST}/${img}`;
          });
        });
      });
    }));
  }

  onDeleteCategory(id: String): Observable<Object> {
    return this.http.delete<Object>(`${API.HOST}/${API.CATEGORY.BASE}/${id}`);
  }

  onAddCategory(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(`${API.HOST}/${API.CATEGORY.BASE}`, category);
  }

  onGetById(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`${API.HOST}/${API.CATEGORY.BASE}/find/${id}`);
  }

  onUpdateCategory(category: ICategory): Observable<ICategory> {
    return this.http.put<ICategory>(`${API.HOST}/${API.CATEGORY.BASE}`, category);
  }

  onCategoryTypes(): Observable<any> {
    return this.http.get<any>(`${API.HOST}/${API.CATEGORY.BASE}/${API.CATEGORY.TYPE}`);
  }
}
