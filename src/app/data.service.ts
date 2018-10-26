import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public _tokenChanged: Subject<any> = new Subject<any>();
  get tokenChanged() {
    return this._tokenChanged.asObservable();
  }

  constructor(private httpClient: HttpClient) {}

  login(user) {
    return this.httpClient.post(`${API_URL}/users/login`, user);
  }

  register(user) {
    return this.httpClient.post(`${API_URL}/users/register`, user);
  }

  getAllUsers() {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('token'));
    return this.httpClient.get(`${API_URL}/users`, {
      headers
    });
  }

  editUser(newUser) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('token'));
    return this.httpClient.put(`${API_URL}/users/updateUser`, newUser, {
      headers
    });
  }

  deleteUser(id) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('token'));
    return this.httpClient.delete(`${API_URL}/users/delete?userId=${id}`, {
      headers
    });
  }
}
