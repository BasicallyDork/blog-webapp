import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  _url = environment.baseUrl;


  constructor(private _http: HttpClient) { }
  getSeoByPage(param: any):Observable<any> {
    return this._http.post(this._url+'/dummy/page-seo',param);
  }
}
