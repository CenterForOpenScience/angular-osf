import { NgxsModule } from '@ngxs/store';

import { TranslateModule, TranslateStore } from '@ngx-translate/core';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MyProjectsState } from '@osf/features/my-projects/store/my-projects.state';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, NgxsModule.forRoot([MyProjectsState]), TranslateModule.forRoot()],
      providers: [provideRouter([]), provideHttpClient(withFetch()), provideHttpClientTesting(), TranslateStore],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
