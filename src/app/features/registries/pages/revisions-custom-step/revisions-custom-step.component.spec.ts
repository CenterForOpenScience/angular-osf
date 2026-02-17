import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomStepComponent } from '../../components/custom-step/custom-step.component';
import { RegistriesSelectors, UpdateSchemaResponse } from '../../store';

import { RevisionsCustomStepComponent } from './revisions-custom-step.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder, provideActivatedRouteMock } from '@testing/providers/route-provider.mock';
import { provideRouterMock, RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RevisionsCustomStepComponent', () => {
  let component: RevisionsCustomStepComponent;
  let fixture: ComponentFixture<RevisionsCustomStepComponent>;
  let store: Store;
  let mockRouter: RouterMockType;

  beforeEach(() => {
    const mockRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'rev-1', step: '1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/registries/revisions/rev-1/1').build();

    TestBed.configureTestingModule({
      imports: [RevisionsCustomStepComponent, MockComponents(CustomStepComponent)],
      providers: [
        provideOSFCore(),
        provideActivatedRouteMock(mockRoute),
        provideRouterMock(mockRouter),
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
    });

    fixture = TestBed.createComponent(RevisionsCustomStepComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
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
    component.onUpdateAction({ x: 2 });
    expect(store.dispatch).toHaveBeenCalledWith(new UpdateSchemaResponse('rev-1', 'because', { x: 2 }));
  });

  it('should navigate back to justification on onBack', () => {
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../', 'justification'],
      expect.objectContaining({ relativeTo: expect.anything() })
    );
  });

  it('should navigate to review on onNext', () => {
    component.onNext();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../', 'review'],
      expect.objectContaining({ relativeTo: expect.anything() })
    );
  });
});
