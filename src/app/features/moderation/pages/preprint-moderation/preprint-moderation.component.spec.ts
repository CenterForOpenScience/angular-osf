import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { IS_MEDIUM } from '@osf/shared/utils';
import { TranslateServiceMock } from '@shared/mocks';

import { PreprintModerationComponent } from './preprint-moderation.component';

describe('PreprintModerationComponent', () => {
  let component: PreprintModerationComponent;
  let fixture: ComponentFixture<PreprintModerationComponent>;
  let isMediumSubject: BehaviorSubject<boolean>;

  const mockActivatedRoute = {
    snapshot: {
      firstChild: {
        data: {
          tab: null,
        },
      },
    },
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    isMediumSubject = new BehaviorSubject<boolean>(true);
    await TestBed.configureTestingModule({
      imports: [PreprintModerationComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, isMediumSubject),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
