import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { ResourceIsSpammedComponent } from './resource-is-spammed.component';

describe('ResourceIsSpammedComponent', () => {
  let component: ResourceIsSpammedComponent;
  let fixture: ComponentFixture<ResourceIsSpammedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResourceIsSpammedComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(ResourceIsSpammedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set supportEmail from environment token', () => {
    expect(component.supportEmail).toBe('support@test.com');
  });
});
