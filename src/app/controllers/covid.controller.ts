import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Global } from '@models/summary/global.model';
import { byCountry } from '@models/country/country.model';

@Injectable({
  providedIn: 'root',
})
export class CovidController {
  private _getSummary = 'https://api.covid19api.com/summary';
  private _getCountry = 'https://api.covid19api.com/country/';

  constructor(private http: HttpClient) { }

  async getSummary(): Promise<Global> {
    const res = await this.http.get<Global>(this._getSummary).toPromise();
    return res;
  }

  async getCountry(slug: string, dateFrom: string, dateTo: string): Promise<byCountry[]> {
    const res = await this.http.get<byCountry[]>(this._getCountry + slug + '/status/confirmed?from=' + dateFrom + '&to=' + dateTo).toPromise();
    return res;
  }

}
