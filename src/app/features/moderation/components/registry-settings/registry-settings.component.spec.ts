import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrySettingsComponent } from './registry-settings.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RegistrySettingsComponent', () => {
  let component: RegistrySettingsComponent;
  let fixture: ComponentFixture<RegistrySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrySettingsComponent, OSFTestingModule, MockPipe(TranslatePipe)],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
