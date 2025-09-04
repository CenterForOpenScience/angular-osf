import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { IS_XSMALL } from '@osf/shared/helpers';
import { ResourceCardComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { MOCK_AGENT_RESOURCE, MOCK_RESOURCE, MOCK_USER_RELATED_COUNTS, TranslateServiceMock } from '@shared/mocks';
import { Resource } from '@shared/models';
import { ResourceCardService } from '@shared/services';

describe.skip('ResourceCardComponent', () => {
  let component: ResourceCardComponent;
  let fixture: ComponentFixture<ResourceCardComponent>;

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
        TranslateServiceMock,
        provideNoopAnimations(),
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

  it('should have item as required model input', () => {
    fixture.componentRef.setInput('item', mockResource);
    expect(component.resource()).toEqual(mockResource);
  });

  it('should have isSmall signal from IS_XSMALL', () => {
    expect(component.isSmall()).toBe(false);
  });

  it('should return early when item is null', () => {
    fixture.componentRef.setInput('item', null);

    const getUserCountsSpy = jest.spyOn(TestBed.inject(ResourceCardService), 'getUserRelatedCounts');

    component.onOpen();

    expect(getUserCountsSpy).not.toHaveBeenCalled();
  });

  it('should return early when data is already loaded', () => {
    fixture.componentRef.setInput('item', mockAgentResource);
    component.dataIsLoaded = true;

    const getUserCountsSpy = jest.spyOn(TestBed.inject(ResourceCardService), 'getUserRelatedCounts');

    component.onOpen();

    expect(getUserCountsSpy).not.toHaveBeenCalled();
  });

  it('should return early when resource type is not Agent', () => {
    fixture.componentRef.setInput('item', mockResource);

    const getUserCountsSpy = jest.spyOn(TestBed.inject(ResourceCardService), 'getUserRelatedCounts');

    component.onOpen();

    expect(getUserCountsSpy).not.toHaveBeenCalled();
  });

  it('should call service when all conditions are met', () => {
    fixture.componentRef.setInput('item', mockAgentResource);
    component.dataIsLoaded = false;

    const getUserCountsSpy = jest.spyOn(TestBed.inject(ResourceCardService), 'getUserRelatedCounts');

    component.onOpen();

    expect(getUserCountsSpy).toHaveBeenCalledWith('user-123');
  });

  it('should handle item with id that does not contain slash', () => {
    const mockItemWithoutSlash = {
      ...mockAgentResource,
      id: 'simple-id-without-slash',
    };
    fixture.componentRef.setInput('item', mockItemWithoutSlash);
    component.dataIsLoaded = false;

    const getUserCountsSpy = jest.spyOn(TestBed.inject(ResourceCardService), 'getUserRelatedCounts');

    component.onOpen();

    expect(getUserCountsSpy).toHaveBeenCalledWith('simple-id-without-slash');
  });
});
