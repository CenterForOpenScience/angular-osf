import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TranslateServiceMock } from '@shared/mocks';

import { BrowseBySubjectsComponent } from './browse-by-subjects.component';

describe('BrowseBySubjectsComponent', () => {
  let component: BrowseBySubjectsComponent;
  let fixture: ComponentFixture<BrowseBySubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseBySubjectsComponent, MockPipe(TranslatePipe)],
      providers: [provideRouter([]), TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(BrowseBySubjectsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('subjects', []);
    fixture.componentRef.setInput('areSubjectsLoading', false);
    fixture.componentRef.setInput('isProviderLoading', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
