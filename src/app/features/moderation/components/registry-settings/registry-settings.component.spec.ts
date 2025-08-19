import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { BulkUploadComponent } from '@osf/features/moderation/components';

import { RegistrySettingsComponent } from './registry-settings.component';

describe('RegistrySettingsComponent', () => {
  let component: RegistrySettingsComponent;
  let fixture: ComponentFixture<RegistrySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrySettingsComponent, MockComponent(BulkUploadComponent), MockPipe(TranslatePipe)],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
