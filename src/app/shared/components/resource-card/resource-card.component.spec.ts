import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { ResourceCardComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { MOCK_AGENT_RESOURCE, MOCK_RESOURCE, MOCK_USER_RELATED_COUNTS, TranslateServiceMock } from '@shared/mocks';
import { Resource } from '@shared/models';
import { ResourceCardService } from '@shared/services';
import { IS_XSMALL } from '@shared/utils';

describe('ResourceCardComponent', () => {
  let component: ResourceCardComponent;
  let fixture: ComponentFixture<ResourceCardComponent>;
  let router: Router;

  const mockUserCounts = MOCK_USER_RELATED_COUNTS;

  const mockResource: Resource = MOCK_RESOURCE;
  const mockAgentResource: Resource = MOCK_AGENT_RESOURCE;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceCardComponent],
      providers: [
        MockProvider(ResourceCardService, {
          getUserRelatedCounts: jest.fn().mockReturnValue(of(mockUserCounts)),
        }),
        MockProvider(IS_XSMALL, of(false)),
        MockProvider(Router),
        TranslateServiceMock,
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have ResourceType enum available', () => {
    expect(component.ResourceType).toBe(ResourceType);
  });

  it('should have item as required model input', () => {
    fixture.componentRef.setInput('item', mockResource);
    expect(component.item()).toEqual(mockResource);
  });

  it('should have isSmall signal from IS_XSMALL', () => {
    expect(component.isSmall()).toBe(false);
  });

  it('should navigate to registries for registration resources', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.redirectToResource(mockResource);

    expect(navigateSpy).toHaveBeenCalledWith(['/registries', 'resource-123']);
  });

  it('should not navigate for non-registration resources', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.redirectToResource(mockAgentResource);

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
