import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Global } from '@models/summary/global.model';
import { byCountry } from '@models/country/country.model';

@Injectable({
  providedIn: 'root',
})
export class CovidController {
  private readonly _getSummary = 'https://api.covid19api.com/summary';
  private readonly _getCountry = 'https://api.covid19api.com/country/';
  headers: any;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders().set("X-Access-Token", "5cf9dfd5-3449-485e-b5ae-70a60e997864");
  }

  async getSummary(): Promise<Global> {
    const res = await this.http.get<Global>(this._getSummary, {'headers': this.headers}).toPromise();
    return res;
  }

  async getCountry(slug: string, dateFrom: string, dateTo: string): Promise<byCountry[]> {
    const res = await this.http.get<byCountry[]>(this._getCountry + slug + '/status/confirmed?from=' + dateFrom + '&to=' + dateTo).toPromise();
    return res;
  }

}
