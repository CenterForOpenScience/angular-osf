import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { IS_WEB } from '@shared/utils';

import { PreprintsComponent } from './preprints.component';

describe('PreprintsComponent', () => {
  let component: PreprintsComponent;
  let fixture: ComponentFixture<PreprintsComponent>;
  let isWebSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [PreprintsComponent],
      providers: [provideRouter([]), MockProvider(IS_WEB, isWebSubject)],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
