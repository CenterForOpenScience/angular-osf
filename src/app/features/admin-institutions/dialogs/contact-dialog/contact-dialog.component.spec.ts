import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProviders } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDialogComponent } from './contact-dialog.component';

describe('ContactDialogComponent', () => {
  let component: ContactDialogComponent;
  let fixture: ComponentFixture<ContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDialogComponent, MockPipe(TranslatePipe)],
      providers: [MockProviders(DynamicDialogRef, DynamicDialogConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
