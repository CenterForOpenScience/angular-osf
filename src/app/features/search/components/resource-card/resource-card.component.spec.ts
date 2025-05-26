import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IS_XSMALL } from '@osf/shared/utils';

import { ResourceCardService } from '../../services';

import { ResourceCardComponent } from './resource-card.component';

describe('MyProfileResourceCardComponent', () => {
  let component: ResourceCardComponent;
  let fixture: ComponentFixture<ResourceCardComponent>;

  const mockUserCounts = {
    projects: 5,
    preprints: 3,
    registrations: 2,
    education: 'Test University',
    employment: 'Test Company',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceCardComponent],
      providers: [
        MockProvider(ResourceCardService, {
          getUserRelatedCounts: jest.fn().mockReturnValue(of(mockUserCounts)),
        }),
        MockProvider(IS_XSMALL, of(false)),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
