import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../../models/category';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  private baseUrl = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) {}

  getAllCategories() {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getProductsByCat(id: number) {
    return this.http.get<any>(`${this.baseUrl}/ProductByCategory?categoryId=${id}&page=1&pageSize=100`);
  }
}