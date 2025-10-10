import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IS_XSMALL } from '@osf/shared/helpers';
import { ResourceCardComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { MOCK_AGENT_RESOURCE, MOCK_RESOURCE, MOCK_USER_RELATED_COUNTS } from '@shared/mocks';
import { ResourceModel } from '@shared/models';
import { ResourceCardService } from '@shared/services';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ResourceCardComponent', () => {
  let component: ResourceCardComponent;
  let fixture: ComponentFixture<ResourceCardComponent>;

  const mockUserCounts = MOCK_USER_RELATED_COUNTS;

  const mockResource: ResourceModel = MOCK_RESOURCE;
  const mockAgentResource: ResourceModel = MOCK_AGENT_RESOURCE;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceCardComponent, OSFTestingModule],
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

  it('should have ResourceType enum available', () => {
    expect(component.ResourceType).toBe(ResourceType);
  });

  it('should have resource as required model input', () => {
    fixture.componentRef.setInput('resource', mockResource);
    expect(component.resource()).toEqual(mockResource);
  });

  it('should have isSmall signal from IS_XSMALL', () => {
    expect(component.isSmall()).toBe(false);
  });

  it('should return early when resource is null', () => {
    fixture.componentRef.setInput('resource', null);

    const getUserCountsSpy = jest.spyOn(TestBed.inject(ResourceCardService), 'getUserRelatedCounts');

    component.onOpen();

    expect(getUserCountsSpy).not.toHaveBeenCalled();
  });

  it('should return early when data is already loaded', () => {
    fixture.componentRef.setInput('resource', mockAgentResource);
    component.dataIsLoaded = true;

    const getUserCountsSpy = jest.spyOn(TestBed.inject(ResourceCardService), 'getUserRelatedCounts');

    component.onOpen();

    expect(getUserCountsSpy).not.toHaveBeenCalled();
  });

  it('should return early when resource type is not Agent', () => {
    fixture.componentRef.setInput('resource', mockResource);

    const getUserCountsSpy = jest.spyOn(TestBed.inject(ResourceCardService), 'getUserRelatedCounts');

    component.onOpen();

    expect(getUserCountsSpy).not.toHaveBeenCalled();
  });

  it('should call service when all conditions are met', () => {
    fixture.componentRef.setInput('resource', mockAgentResource);
    component.dataIsLoaded = false;

    const getUserCountsSpy = jest.spyOn(TestBed.inject(ResourceCardService), 'getUserRelatedCounts');

    component.onOpen();

    expect(getUserCountsSpy).toHaveBeenCalledWith('user-123');
  });

  it('should handle resource with absoluteUrl containing user id', () => {
    const mockResourceWithDifferentUrl = {
      ...mockAgentResource,
      absoluteUrl: 'https://api.osf.io/v2/users/simple-id-without-slash',
    };
    fixture.componentRef.setInput('resource', mockResourceWithDifferentUrl);
    component.dataIsLoaded = false;

    const getUserCountsSpy = jest.spyOn(TestBed.inject(ResourceCardService), 'getUserRelatedCounts');

    component.onOpen();

    expect(getUserCountsSpy).toHaveBeenCalledWith('simple-id-without-slash');
  });
});
