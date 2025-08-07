import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { FormSelectComponent, TextInputComponent } from '@shared/components';

import { InviteModeratorDialogComponent } from './invite-moderator-dialog.component';

describe('InviteModeratorDialogComponent', () => {
  let component: InviteModeratorDialogComponent;
  let fixture: ComponentFixture<InviteModeratorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InviteModeratorDialogComponent,
        ...MockComponents(TextInputComponent, FormSelectComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [MockProvider(DynamicDialogRef), MockProvider(ActivatedRoute)],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteModeratorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
