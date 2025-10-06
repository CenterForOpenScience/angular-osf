import { MockProviders } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@osf/shared/mocks';

import { RequestAccessTableComponent } from './request-access-table.component';

describe.skip('RequestAccessTableComponent', () => {
  let component: RequestAccessTableComponent;
  let fixture: ComponentFixture<RequestAccessTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAccessTableComponent],
      providers: [MockProviders(DialogService), TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAccessTableComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
