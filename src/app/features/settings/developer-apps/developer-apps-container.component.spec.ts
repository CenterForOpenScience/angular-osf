import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Subject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperAppAddEditFormComponent } from '@osf/features/settings/developer-apps/components';
import { ToastService } from '@shared/services';

import { DeveloperAppsContainerComponent } from './developer-apps-container.component';

import { TranslateServiceMock } from '@testing/mocks';

describe('DeveloperAppsContainerComponent', () => {
  let component: DeveloperAppsContainerComponent;
  let fixture: ComponentFixture<DeveloperAppsContainerComponent>;
  let translateService: TranslateService;
  let dialogRefMock: Partial<DynamicDialogRef>;
  let dialogService: DialogService;
  let openSpy: jest.SpyInstance;
  let translateSpy: jest.SpyInstance;

  beforeEach(async () => {
    dialogRefMock = { onClose: new Subject<void>() };

    await TestBed.configureTestingModule({
      imports: [DeveloperAppsContainerComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(DialogService), MockProvider(ToastService), TranslateServiceMock],
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

  it('should open dialog with 500px width', () => {
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
