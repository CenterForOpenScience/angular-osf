import { NgxsModule } from '@ngxs/store';

import { ConfirmationService } from 'primeng/api';

import { of } from 'rxjs';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { DeveloperAppsState } from '../store';

import { DeveloperAppDetailsComponent } from './developer-app-details.component';

describe('DeveloperAppDetailsComponent', () => {
  let component: DeveloperAppDetailsComponent;
  let fixture: ComponentFixture<DeveloperAppDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperAppDetailsComponent, NgxsModule.forRoot([DeveloperAppsState])],
      providers: [
        ConfirmationService,
        provideHttpClient(withFetch()),
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperAppDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
