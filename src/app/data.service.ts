import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URL = 'http://localhost:3005';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  login(user) {
    return this.httpClient.post(`${API_URL}/users/login`, user);
  }

  register(user) {
    return this.httpClient.post(`${API_URL}/users/register`, user);
  }
}
