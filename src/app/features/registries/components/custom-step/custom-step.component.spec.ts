import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
import { FieldType } from '@osf/shared/enums/field-type.enum';
import { ToastService } from '@osf/shared/services/toast.service';
import { FileModel } from '@shared/models/files/file.model';
import { FilePayloadJsonApi } from '@shared/models/files/file-payload-json-api.model';
import { PageSchema } from '@shared/models/registration/page-schema.model';

import { RegistriesSelectors, SetUpdatedFields, UpdateStepState } from '../../store';
import { FilesControlComponent } from '../files-control/files-control.component';

import { CustomStepComponent } from './custom-step.component';

import { MOCK_REGISTRIES_PAGE, MOCK_STEPS_DATA } from '@testing/mocks/registries.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

type StepsState = Record<string, { invalid: boolean; touched: boolean }>;

describe('CustomStepComponent', () => {
  let component: CustomStepComponent;
  let fixture: ComponentFixture<CustomStepComponent>;
  let store: Store;
  let routeBuilder: ActivatedRouteMockBuilder;
  let mockRouter: RouterMockType;
  let toastMock: ToastServiceMockType;
  let pagesSignal: WritableSignal<PageSchema[]>;
  let stepsStateSignal: WritableSignal<StepsState>;

  function createComponent(
    page: PageSchema,
    stepsData: Record<string, unknown> = {},
    stepsState: StepsState = {}
  ): ComponentFixture<CustomStepComponent> {
    pagesSignal.set([page]);
    stepsStateSignal.set(stepsState);
    const f = TestBed.createComponent(CustomStepComponent);
    f.componentRef.setInput('stepsData', stepsData);
    f.componentRef.setInput('filesLink', 'files-link');
    f.componentRef.setInput('projectId', 'project');
    f.componentRef.setInput('provider', 'provider');
    f.detectChanges();
    return f;
  }

  function createPage(
    questions: PageSchema['questions'] = [],
    sections: PageSchema['sections'] = undefined
  ): PageSchema {
    return { id: 'p', title: 'P', questions, sections };
  }

  beforeEach(() => {
    toastMock = ToastServiceMock.simple();
    routeBuilder = ActivatedRouteMockBuilder.create().withParams({ step: 1 });
    mockRouter = RouterMockBuilder.create().withUrl('/registries/drafts/id/1').build();
    pagesSignal = signal<PageSchema[]>([MOCK_REGISTRIES_PAGE]);
    stepsStateSignal = signal<StepsState>({});

    TestBed.configureTestingModule({
      imports: [CustomStepComponent, ...MockComponents(InfoIconComponent, FilesControlComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ToastService, toastMock),
        MockProvider(ActivatedRoute, routeBuilder.build()),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getPagesSchema, value: pagesSignal },
            { selector: RegistriesSelectors.getStepsState, value: stepsStateSignal },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
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
    expect(Object.keys(component['stepForm'].controls)).toContain('field1');
    expect(Object.keys(component['stepForm'].controls)).toContain('field2');
  });

  it('should emit back on first step', () => {
    const backSpy = jest.spyOn(component.back, 'emit');
    component.goBack();
    expect(backSpy).toHaveBeenCalled();
  });

  it('should navigate to previous step on step > 1', () => {
    component.step.set(2);
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../', 1], { relativeTo: expect.anything() });
  });

  it('should navigate to next step within pages', () => {
    pagesSignal.set([MOCK_REGISTRIES_PAGE, MOCK_REGISTRIES_PAGE]);
    component.goNext();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../', 2], { relativeTo: expect.anything() });
  });

  it('should emit next on last step', () => {
    const nextSpy = jest.spyOn(component.next, 'emit');
    component.step.set(1);
    component.goNext();
    expect(nextSpy).toHaveBeenCalled();
  });

  it('should dispatch updateStepState on ngOnDestroy', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(UpdateStepState));
  });

  it('should emit updateAction and dispatch setUpdatedFields when fields changed', () => {
    const emitSpy = jest.spyOn(component.updateAction, 'emit');
    component['stepForm'].get('field1')?.setValue('changed');
    (store.dispatch as jest.Mock).mockClear();

    component.ngOnDestroy();

    expect(emitSpy).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new SetUpdatedFields({ field1: 'changed' }));
  });

  it('should not emit updateAction when no fields changed', () => {
    const emitSpy = jest.spyOn(component.updateAction, 'emit');
    (store.dispatch as jest.Mock).mockClear();

    component.ngOnDestroy();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SetUpdatedFields));
  });

  it('should skip saveStepState when form has no controls', () => {
    component.stepForm = new FormGroup({});
    (store.dispatch as jest.Mock).mockClear();

    component.ngOnDestroy();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should attach file and emit updateAction', () => {
    const emitSpy = jest.spyOn(component.updateAction, 'emit');
    const mockFile = {
      id: 'new-file',
      name: 'new.txt',
      links: { html: 'http://html', download: 'http://dl' },
      extra: { hashes: { sha256: 'abc' } },
    } as FileModel;

    component.onAttachFile(mockFile, 'field1');

    expect(component.attachedFiles['field1'].length).toBe(1);
    expect(emitSpy).toHaveBeenCalled();
    expect(emitSpy.mock.calls[0][0]['field1'][0].file_id).toBe('new-file');
  });

  it('should not attach duplicate file', () => {
    component.attachedFiles['field1'] = [{ file_id: 'file-1', name: 'existing.txt' }];
    const emitSpy = jest.spyOn(component.updateAction, 'emit');

    component.onAttachFile({ id: 'file-1' } as FileModel, 'field1');

    expect(component.attachedFiles['field1'].length).toBe(1);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should show warning when attachment limit reached', () => {
    component.attachedFiles['field1'] = Array.from({ length: 5 }, (_, i) => ({ file_id: `f-${i}`, name: `f-${i}` }));

    const mockFile = {
      id: 'new',
      name: 'new.txt',
      links: { html: '', download: '' },
      extra: { hashes: { sha256: '', md5: '' } },
    } as FileModel;
    component.onAttachFile(mockFile, 'field1');

    expect(toastMock.showWarn).toHaveBeenCalledWith('shared.files.limitText');
    expect(component.attachedFiles['field1'].length).toBe(5);
  });

  it('should remove file and emit updateAction', () => {
    const emitSpy = jest.spyOn(component.updateAction, 'emit');
    component.attachedFiles['field1'] = [
      { file_id: 'f1', name: 'a' },
      { file_id: 'f2', name: 'b' },
    ];

    component.removeFromAttachedFiles({ file_id: 'f1', name: 'a' }, 'field1');

    expect(component.attachedFiles['field1'].length).toBe(1);
    expect(component.attachedFiles['field1'][0].file_id).toBe('f2');
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should skip non-existent questionKey', () => {
    const emitSpy = jest.spyOn(component.updateAction, 'emit');
    component.removeFromAttachedFiles({ file_id: 'f1' }, 'nonexistent');
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should save step state and update step on route param change', () => {
    (store.dispatch as jest.Mock).mockClear();
    routeBuilder.withParams({ step: 2 });

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(UpdateStepState));
    expect(component.step()).toBe(2);
  });

  it('should mark form touched when stepsState has invalid for current step', () => {
    const f = createComponent(MOCK_REGISTRIES_PAGE, MOCK_STEPS_DATA, {
      1: { invalid: true, touched: true },
    });
    expect(f.componentInstance['stepForm'].get('field1')?.touched).toBe(true);
  });

  it('should initialize checkbox control with empty array default', () => {
    const page = createPage([
      { id: 'q', displayText: '', responseKey: 'cbField', fieldType: FieldType.Checkbox, required: true },
    ]);
    const f = createComponent(page);
    expect(f.componentInstance['stepForm'].get('cbField')?.value).toEqual([]);
  });

  it('should initialize radio control with required validator', () => {
    const page = createPage([
      { id: 'q', displayText: '', responseKey: 'radioField', fieldType: FieldType.Radio, required: true },
    ]);
    const f = createComponent(page);
    expect(f.componentInstance['stepForm'].get('radioField')?.valid).toBe(false);
  });

  it('should initialize file control and populate attachedFiles', () => {
    const page = createPage([
      { id: 'q', displayText: '', responseKey: 'fileField', fieldType: FieldType.File, required: false },
    ]);
    const files: FilePayloadJsonApi[] = [
      { file_id: 'f1', file_name: 'doc.pdf', file_urls: { html: '', download: '' }, file_hashes: { sha256: '' } },
    ];
    const f = createComponent(page, { fileField: files });

    expect(f.componentInstance.attachedFiles['fileField'].length).toBe(1);
    expect(f.componentInstance.attachedFiles['fileField'][0].name).toBe('doc.pdf');
  });

  it('should skip unknown field types', () => {
    const page = createPage([
      { id: 'q', displayText: '', responseKey: 'unknownField', fieldType: 'unknown' as FieldType, required: false },
    ]);
    const f = createComponent(page);
    expect(f.componentInstance['stepForm'].get('unknownField')).toBeNull();
  });

  it('should include section questions', () => {
    const page = createPage(
      [],
      [
        {
          id: 's1',
          title: 'S',
          questions: [
            { id: 'q', displayText: '', responseKey: 'secField', fieldType: FieldType.Text, required: false },
          ],
        },
      ]
    );
    const f = createComponent(page, { secField: 'val' });

    expect(f.componentInstance['stepForm'].get('secField')).toBeDefined();
    expect(f.componentInstance['stepForm'].get('secField')?.value).toBe('val');
  });
});
