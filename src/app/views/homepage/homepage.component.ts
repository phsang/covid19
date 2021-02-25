import { Component, OnInit } from '@angular/core';
import { Global } from '@models/summary/global.model';
import { CovidController } from '@controllers/covid.controller';
import { Country } from '@models/summary/country.model';
import { byCountry } from '@models/country/country.model';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  _global: Global;
  _country: byCountry[];
  _fromDate: Date;
  _toDate: Date;
  _currentCountry: string;
  _countrySlug: string;
  _numberDate: number = 30;

  constructor(
    private covidController: CovidController
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getSummary();
    this.getOneCountry(this._global.Countries[0].Slug);
  }

  async getSummary() {
    this._global = await this.covidController.getSummary();
    this._currentCountry = this._global.Countries[0].Country;
    this._countrySlug = this._global.Countries[0].Slug;
    this._global.Global.Date = new Date(this._global.Global.Date);
  }

  searchCountry($event) {
    let _filValue = $event.target.value.toLowerCase();
    let _listCountry = document.querySelectorAll(".country_item");
    for (let i = 0; i < _listCountry.length; i++) {
      if(!_filValue) {
        _listCountry[i].classList.remove('fil');
      } else {
        let _countryName = _listCountry[i].textContent.toLowerCase();
        if(_countryName.match(_filValue)) {
          _listCountry[i].classList.remove('fil');
        } else {
          _listCountry[i].classList.add('fil');
        }
      }
    }
  }

  async chooseCountry($event) {
    let _listCountry = document.querySelectorAll(".country_item")
    for (let i = 0; i < _listCountry.length; i++) {
      _listCountry[i].classList.remove('active');
    }

    this._countrySlug = $event.target.getAttribute('data-slug');
    let _country = $event.target.getAttribute('data-country');
    $event.target.parentElement.classList.add("active");
    this._currentCountry = _country;

    // call ajax country
    this.getOneCountry(this._countrySlug);
  }

  async getOneCountry(country_slug) {
    let dateTo = new Date();
    let dateFrom = new Date();
    dateTo.setUTCHours(0, 0, 0, 0);
    dateFrom.setUTCHours(0, 0, 0, 0);
    console.log(this._numberDate);
    dateFrom.setDate(dateTo.getDate() - this._numberDate);
    let strDateFrom = dateFrom.toISOString();
    let strDateTo = dateTo.toISOString();
    
    // var dateString = date.toISOString().split('T')[0];
    this._country = await this.covidController.getCountry(country_slug, strDateFrom, strDateTo);
    this._country[this._country.length - 1].Date = new Date(this._country[0].Date);

    this.drawMapOfCase();
  }

  updateNumberDate($event) {
    if(parseInt($event.target.value) >= 10 && parseInt($event.target.value) <= 365) {
      this._numberDate = parseInt($event.target.value);
      this.getOneCountry(this._countrySlug);
    }
  }

  drawMapOfCase() {
    //---- draw chart
    let c = <HTMLCanvasElement>document.getElementById("covid_chart_map");
    c.width = 360;
    c.height = 180;
    /* setup data to draw chart */
    let mapWidth = c.width - 45;
    let mapHeight = c.height - 12;
    let barWidth = mapWidth / this._numberDate;
    var dataChart = [];
    for (let i = 0; i < this._country.length; i++) {
      dataChart.push(this._country[i].Cases);
    }
    let maxDataChart = dataChart[dataChart.length - 1];
    let stepHeight = mapHeight / (maxDataChart - dataChart[0]);

    /* draw chart */
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, mapWidth + 45, mapHeight + 12);
    /* Draw line */
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#333';
    ctx.moveTo(0, 0);
    ctx.lineTo(0, mapHeight);
    ctx.lineTo(mapWidth, mapHeight);
    ctx.stroke();
    /* Draw text */
    ctx.font = "12px Arial";
    ctx.fillText(dataChart[0].toString(), mapWidth, mapHeight);
    ctx.fillText(maxDataChart.toString(), mapWidth, 10);
    ctx.fillText(this._country[0].Date.toString().split('T')[0], 0, mapHeight + 12);
    ctx.fillText(this._country[this._country.length - 1].Date.toString().split('T')[0], mapWidth - 65, mapHeight + 12);
    ctx.beginPath();
    for (let i = 0; i < dataChart.length; i++) {
      ctx.moveTo(i * barWidth, mapHeight);
      let newY = mapHeight - ((dataChart[i] - dataChart[0]) * stepHeight);
      ctx.lineWidth = barWidth - 2;
      ctx.lineTo(i * barWidth, newY);
      ctx.strokeStyle = '#00809D';
      ctx.stroke();
    }
  }

}
