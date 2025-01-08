import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  constructor() { }

  /**
   * Realiza la llamada a la api mediante el metodo get
   * @param url
   */
  public get(url: string): Observable<any>{
    return this.http.get(environment.url + url, {responseType: 'text'});
  }

  /**
   * Realiza la llamada a la api mediante el metodo post
   * @param url
   * @param body
   */
  public post(url:string, body: any): Observable<any>{
    return this.http.post(environment.url + url, body);
  }

  /**
   * Realiza la llamada a la api mediante el metodo put
   * @param url
   * @param body
   */
  public put(url:string, body: any): Observable<any>{
    return this.http.put(environment.url + url, body);
  }

  /**
   * Realiza la llamada a la api mediante el metodo delete
   * @param url
   */
  public delete(url:string): Observable<any>{
    return this.http.delete(environment.url + url);
  }
}
