import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { IS_MEDIUM } from '@osf/shared/helpers';

import { CollectionModerationComponent } from './collection-moderation.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('Component: Collection Moderation', () => {
  let component: CollectionModerationComponent;
  let fixture: ComponentFixture<CollectionModerationComponent>;
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
      imports: [CollectionModerationComponent, OSFTestingStoreModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        MockProvider(IS_MEDIUM, isMediumSubject),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
