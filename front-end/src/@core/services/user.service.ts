import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/@core/config/API';
import { IUser } from 'src/@core/interface/IUser.interface';

@Injectable({ providedIn: "root" })
export class UserService {

  constructor(private http: HttpClient) { }

  onSignIn(user: any): Observable<any> {
    return this.http.post(`${API.HOST}/api/auth/login`, user);
  }

  onFetchUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${API.HOST}/api/user`);
  }

  onDeleteUser(id: String): Observable<Object> {
    return this.http.delete<Object>(`${API.HOST}/${API.USER.BASE}/${id}`);
  }

  onCreateNewUser(user: IUser): Observable<Object> {
    return this.http.post<Object>(`${API.HOST}/${API.USER.BASE}`, user);
  }

  onUpdateUser(formData: FormData): Observable<Object> {
    return this.http.put<Object>(`${API.HOST}/${API.USER.BASE}/${API.USER.UPDATE}`, formData);
  }
}
