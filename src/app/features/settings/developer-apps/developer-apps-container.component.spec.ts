import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { BehaviorSubject, Subject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperAppAddEditFormComponent } from '@osf/features/settings/developer-apps/components';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';

import { DeveloperAppsContainerComponent } from './developer-apps-container.component';

describe('DeveloperAppsContainerComponent', () => {
  let component: DeveloperAppsContainerComponent;
  let fixture: ComponentFixture<DeveloperAppsContainerComponent>;
  let isMedium: BehaviorSubject<boolean>;
  let translateService: TranslateService;
  let dialogRefMock: Partial<DynamicDialogRef>;
  let dialogService: DialogService;
  let openSpy: jest.SpyInstance;
  let translateSpy: jest.SpyInstance;

  beforeEach(async () => {
    isMedium = new BehaviorSubject<boolean>(false);
    dialogRefMock = { onClose: new Subject<void>() };

    await TestBed.configureTestingModule({
      imports: [DeveloperAppsContainerComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(DialogService),
        MockProvider(IS_MEDIUM, isMedium),
        MockProvider(ToastService),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperAppsContainerComponent);
    component = fixture.componentInstance;

    translateService = TestBed.inject(TranslateService);
    dialogService = fixture.debugElement.injector.get(DialogService);

    openSpy = jest.spyOn(dialogService, 'open').mockReturnValue(dialogRefMock as DynamicDialogRef);
    translateSpy = jest.spyOn(translateService, 'instant').mockReturnValue('Create Developer App');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog with 340px width when isMedium returns false', () => {
    (component as any).isMedium = jest.fn().mockReturnValue(false);

    component.createDeveloperApp();

    expect(openSpy).toHaveBeenCalledWith(DeveloperAppAddEditFormComponent, {
      width: '340px',
      focusOnShow: false,
      header: 'Create Developer App',
      breakpoints: { '768px': '95vw' },
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
    expect(translateSpy).toHaveBeenCalledWith('settings.developerApps.form.createTitle');
  });

  it('should open dialog with 500px width when isMedium returns true', () => {
    (component as any).isMedium = jest.fn().mockReturnValue(true);

    component.createDeveloperApp();

    expect(openSpy).toHaveBeenCalledWith(DeveloperAppAddEditFormComponent, {
      width: '500px',
      focusOnShow: false,
      header: 'Create Developer App',
      breakpoints: { '768px': '95vw' },
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
    expect(translateSpy).toHaveBeenCalledWith('settings.developerApps.form.createTitle');
  });
});
