import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PreprintServicesComponent } from './preprint-services.component';

describe('PreprintServicesComponent', () => {
  let component: PreprintServicesComponent;
  let fixture: ComponentFixture<PreprintServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintServicesComponent, MockPipe(TranslatePipe)],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintServicesComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preprintProvidersToAdvertise', []);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
