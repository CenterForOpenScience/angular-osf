import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { MigratedLabelComponent } from './migrated-label.component';

describe('MigratedLabelComponent', () => {
  let fixture: ComponentFixture<MigratedLabelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MigratedLabelComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(MigratedLabelComponent);
  });

  it('should render migrated tag when isMigrated is true', () => {
    fixture.componentRef.setInput('isMigrated', true);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('[data-test-migrated-label]');
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('common.labels.migrated');
  });

  it('should not render migrated tag when isMigrated is false', () => {
    fixture.componentRef.setInput('isMigrated', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-test-migrated-label]')).toBeNull();
  });
});
