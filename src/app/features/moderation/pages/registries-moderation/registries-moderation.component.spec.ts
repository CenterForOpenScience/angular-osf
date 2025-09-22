import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { IS_MEDIUM } from '@osf/shared/helpers';

import { RegistriesModerationComponent } from './registries-moderation.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('Component: Registries Moderation', () => {
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
      imports: [RegistriesModerationComponent, OSFTestingStoreModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, isMediumSubject),
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
