import { MockModule, MockProvider } from 'ng-mocks';

import { ToastModule } from 'primeng/toast';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@shared/services';

import { ToastComponent } from './toast.component';

import { TranslateServiceMock } from '@testing/mocks';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent, MockModule(ToastModule)],
      providers: [TranslateServiceMock, MockProvider(ToastService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
