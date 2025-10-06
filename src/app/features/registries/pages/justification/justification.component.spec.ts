import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { LoaderService } from '@osf/shared/services';

import { JustificationComponent } from './justification.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('JustificationComponent', () => {
  let component: JustificationComponent;
  let fixture: ComponentFixture<JustificationComponent>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        firstChild: { params: { id: 'rev-1', step: '0' } } as any,
      } as any,
      firstChild: { snapshot: { params: { id: 'rev-1', step: '0' } } } as any,
    } as Partial<ActivatedRoute>;
    mockRouter = RouterMockBuilder.create().withUrl('/registries/revisions/rev-1/justification').build();

    await TestBed.configureTestingModule({
      imports: [JustificationComponent, OSFTestingModule],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(LoaderService, { show: jest.fn(), hide: jest.fn() }),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getPagesSchema, value: [] },
            { selector: RegistriesSelectors.getStepsState, value: { 0: { invalid: false, touched: false } } },
            {
              selector: RegistriesSelectors.getSchemaResponse,
              value: {
                registrationSchemaId: 'schema-1',
                revisionJustification: 'Reason',
                reviewsState: 'revision_in_progress',
              },
            },
            { selector: RegistriesSelectors.getSchemaResponseRevisionData, value: {} },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JustificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute steps with justification and review', () => {
    const steps = component.steps();
    expect(steps.length).toBe(2);
    expect(steps[0].value).toBe('justification');
    expect(steps[1].value).toBe('review');
  });

  it('should navigate on stepChange', () => {
    const navSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component.stepChange({ index: 1, routeLink: '1', value: 'p1', label: 'Page 1' } as any);
    expect(navSpy).toHaveBeenCalledWith(['/registries/revisions/rev-1/', 'review']);
  });

  it('should clear state on destroy', () => {
    const actionsMock = {
      clearState: jest.fn(),
      getSchemaBlocks: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: () => {} }) }),
    } as any;
    Object.defineProperty(component as any, 'actions', { value: actionsMock });
    fixture.destroy();
    expect(actionsMock.clearState).toHaveBeenCalled();
  });
});
