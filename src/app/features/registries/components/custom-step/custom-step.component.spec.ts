import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { FilesControlComponent } from '@osf/features/registries/components/files-control/files-control.component';
import { RegistriesSelectors } from '@osf/features/registries/store';
import { InfoIconComponent } from '@osf/shared/components';
import { FieldType } from '@osf/shared/enums';

import { CustomStepComponent } from './custom-step.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('CustomStepComponent', () => {
  let component: CustomStepComponent;
  let fixture: ComponentFixture<CustomStepComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

  const MOCK_STEPS_DATA = { field1: 'value1', field2: 'value2' } as any;
  const MOCK_PAGE = {
    id: 'page-1',
    title: 'Page 1',
    questions: [
      { responseKey: 'field1', fieldType: FieldType.Text, required: true },
      { responseKey: 'field2', fieldType: FieldType.Text, required: false },
    ],
  } as any;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ step: 1 }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/registries/drafts/id/1').build();

    await TestBed.configureTestingModule({
      imports: [CustomStepComponent, OSFTestingModule, ...MockComponents(InfoIconComponent, FilesControlComponent)],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getPagesSchema, value: [MOCK_PAGE] },
            { selector: RegistriesSelectors.getStepsState, value: {} },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('stepsData', MOCK_STEPS_DATA);
    fixture.componentRef.setInput('filesLink', 'files-link');
    fixture.componentRef.setInput('projectId', 'project');
    fixture.componentRef.setInput('provider', 'provider');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize stepForm when page available', () => {
    expect(component['stepForm']).toBeDefined();
    expect(Object.keys(component['stepForm'].controls)).toContain('field1');
    expect(Object.keys(component['stepForm'].controls)).toContain('field2');
  });

  it('should navigate back when goBack called on first step', () => {
    const backSpy = jest.spyOn(component.back, 'emit');
    component.goBack();
    expect(backSpy).toHaveBeenCalled();
  });

  it('should navigate next when goNext called with within pages', () => {
    Object.defineProperty(component, 'pages', { value: () => [MOCK_PAGE, MOCK_PAGE] });
    component.goNext();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});
