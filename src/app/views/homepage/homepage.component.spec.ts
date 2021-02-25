import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomepageComponent } from './homepage.component';

import { Global } from '@models/summary/global.model';
import { byCountry } from '@models/country/country.model';
import { isNumber } from 'util';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  let _global: Global;
  let _byCountry: byCountry[];
  let h1: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [HttpClientModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    h1 = fixture.nativeElement.querySelector('h1');
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(HomepageComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('no title in the DOM after createComponent()', () => {
    expect(h1.textContent).toEqual('COVID-19 CORONAVIRUS PANDEMIC');
  });

  it('should get object global', async() => {
    component.getSummary();
    expect(component._global).toEqual(_global);
  });

  it('should get object countries', async() => {
    component.getOneCountry('vietnam');
    expect(component._country).toEqual(_byCountry);
  });

  var textCovidCase = ['New Confirmed: ', 'Total Confirmed: ', 'New Recovered: ', 'Total Recovered: ', 'New Deaths: ', 'Total Deaths: '];
  it('should render General Information', () => {
    const fixture = TestBed.createComponent(HomepageComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const covid_p = Array.from(compiled.querySelectorAll('.covid_case_info p')).map(
      ({ textContent }) => textContent
    );
    for (let i = 0; i < covid_p.length; i++) {
      expect(covid_p[i]).toEqual(textCovidCase[i]);
    }
  });

  it('should choose new country to show covid-19 information', async() => {
    spyOn(component, 'chooseCountry');
    const compiled = fixture.debugElement.nativeElement;
    const elClick = Array.from(compiled.querySelectorAll('#filter_by_country a')).map(
      ({ textContent }) => textContent
    );
    for (let i = 0; i < elClick.length; i++) {
      elClick[i].click();
      expect(component._currentCountry).toEqual(elClick[i].innerText);
    }
  });
});
