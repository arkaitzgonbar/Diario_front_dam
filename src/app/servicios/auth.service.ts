import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

const AUTH_API = 'http://localhost:8000/api/auth'

const httpOptions = {
  headers: new HttpHeaders({'Content-Type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string):Observable<any> {
    return this.http.post(environment.url + environment.ruta_login, {email, password}, httpOptions);
  }

  register(email: string, password: string, nombre: string): Observable<any> {
    return this.http.post(environment.url + environment.ruta_register, {email, password, nombre}, httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post(environment.url + environment.ruta_logout, {}, httpOptions);
  }
}
