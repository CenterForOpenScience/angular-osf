import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { IS_MEDIUM } from '@osf/shared/helpers';
import { TranslateServiceMock } from '@shared/mocks';

import { RegistriesModerationComponent } from './registries-moderation.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesModerationComponent', () => {
  let component: RegistriesModerationComponent;
  let fixture: ComponentFixture<RegistriesModerationComponent>;
  let isMediumSubject: BehaviorSubject<boolean>;

  const mockActivatedRoute = {
    snapshot: {
      firstChild: {
        data: {
          tab: null,
        },
      },
      params: { providerId: 'osf' },
    },
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    isMediumSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [RegistriesModerationComponent, OSFTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, isMediumSubject),
        provideMockStore(),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
