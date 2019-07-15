import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from 'src/@core/interface/ICategory.interface';
import { API } from 'src/@core/config/API';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  onFetchCategorys(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${API.HOST}/${API.CATEGORY.BASE}`);
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
