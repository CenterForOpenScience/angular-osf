import { provideStore } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { InstitutionsAdminState } from '@osf/features/admin-institutions/store';
import { BarChartComponent, LoadingSpinnerComponent, StatisticCardComponent } from '@shared/components';
import { DoughnutChartComponent } from '@shared/components/doughnut-chart/doughnut-chart.component';

import { InstitutionsSummaryComponent } from './institutions-summary.component';

describe('InstitutionsSummaryComponent', () => {
  let component: InstitutionsSummaryComponent;
  let fixture: ComponentFixture<InstitutionsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InstitutionsSummaryComponent,
        ...MockComponents(StatisticCardComponent, LoadingSpinnerComponent, DoughnutChartComponent, BarChartComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        MockProvider(ActivatedRoute, { queryParams: of({}) }),
        MockProvider(TranslateService),
        provideStore([InstitutionsAdminState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
