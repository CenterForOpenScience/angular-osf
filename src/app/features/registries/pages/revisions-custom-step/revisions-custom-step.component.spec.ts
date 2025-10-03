import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomStepComponent } from '@osf/features/registries/components/custom-step/custom-step.component';
import { RegistriesSelectors } from '@osf/features/registries/store';

import { RevisionsCustomStepComponent } from './revisions-custom-step.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RevisionsCustomStepComponent', () => {
  let component: RevisionsCustomStepComponent;
  let fixture: ComponentFixture<RevisionsCustomStepComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'rev-1', step: '1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/registries/revisions/rev-1/1').build();

    await TestBed.configureTestingModule({
      imports: [RevisionsCustomStepComponent, OSFTestingModule, MockComponents(CustomStepComponent)],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: [
            {
              selector: RegistriesSelectors.getSchemaResponse,
              value: {
                registrationId: 'reg-1',
                filesLink: '/files',
                revisionJustification: 'because',
                revisionResponses: { a: 1 },
              },
            },
            { selector: RegistriesSelectors.getSchemaResponseRevisionData, value: { a: 1 } },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RevisionsCustomStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute inputs from schema response', () => {
    expect(component.filesLink()).toBe('/files');
    expect(component.provider()).toBe('reg-1');
    expect(component.projectId()).toBe('reg-1');
    expect(component.stepsData()).toEqual({ a: 1 });
  });

  it('should dispatch updateRevision on onUpdateAction', () => {
    const actionsMock = { updateRevision: jest.fn() } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    component.onUpdateAction({ x: 2 });
    expect(actionsMock.updateRevision).toHaveBeenCalledWith('rev-1', 'because', { x: 2 });
  });

  it('should navigate back to justification on onBack', () => {
    const navSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component.onBack();
    expect(navSpy).toHaveBeenCalledWith(['../', 'justification'], { relativeTo: TestBed.inject(ActivatedRoute) });
  });

  it('should navigate to review on onNext', () => {
    const navSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component.onNext();
    expect(navSpy).toHaveBeenCalledWith(['../', 'review'], { relativeTo: TestBed.inject(ActivatedRoute) });
  });
});
