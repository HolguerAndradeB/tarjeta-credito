import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {

  private urlApp: any = 'https://localhost:44309/';
  private urlEndpoint: any = 'api/tarjeta/';

  constructor(private http: HttpClient) { }

  getListTarjetas(): Observable<any>{
    return this.http.get(this.urlApp + this.urlEndpoint);
  }

  saveTarjeta(tarjeta: any): Observable<any>{
    return this.http.post(this.urlApp + this.urlEndpoint, tarjeta);
  }

  deleteTarjeta(id:number): Observable<any>{
    return this.http.delete(this.urlApp + this.urlEndpoint + id);
  }

  updateTarjeta(id: number, tarjeta: any): Observable<any> {
    return this.http.put(this.urlApp + this.urlEndpoint + id, tarjeta);
  }

}
