import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ToastService } from '@osf/shared/services';

import { RequestAccessComponent } from './request-access.component';

describe('RequestAccessComponent', () => {
  let component: RequestAccessComponent;
  let fixture: ComponentFixture<RequestAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAccessComponent, MockPipe(TranslatePipe)],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(ToastService),
        MockProvider(ActivatedRoute, { params: of({}) }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
