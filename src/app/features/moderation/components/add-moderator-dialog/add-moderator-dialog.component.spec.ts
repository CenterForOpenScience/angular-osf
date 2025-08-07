import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProviders } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorsState } from '@osf/features/moderation/store/moderators';
import { CustomPaginatorComponent, LoadingSpinnerComponent, SearchInputComponent } from '@shared/components';

import { AddModeratorDialogComponent } from './add-moderator-dialog.component';

describe('AddModeratorDialogComponent', () => {
  let component: AddModeratorDialogComponent;
  let fixture: ComponentFixture<AddModeratorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddModeratorDialogComponent,
        MockPipe(TranslatePipe),
        ...MockComponents(SearchInputComponent, LoadingSpinnerComponent, CustomPaginatorComponent),
      ],
      teardown: { destroyAfterEach: false },
      providers: [
        MockProviders(DynamicDialogRef, DynamicDialogConfig),
        provideStore([ModeratorsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddModeratorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
