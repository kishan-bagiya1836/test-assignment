import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getRegionList(): Observable<any> {
    const apiUrl = 'https://api.first.org/data/v1/countries';
    return this.http.get(apiUrl).pipe();
  }
}