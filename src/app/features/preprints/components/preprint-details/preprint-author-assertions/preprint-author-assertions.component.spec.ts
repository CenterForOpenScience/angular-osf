import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';

import { PreprintAuthorAssertionsComponent } from './preprint-author-assertions.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

describe('PreprintAuthorAssertionsComponent', () => {
  let component: PreprintAuthorAssertionsComponent;
  let fixture: ComponentFixture<PreprintAuthorAssertionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreprintAuthorAssertionsComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(PreprintAuthorAssertionsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('preprint', { ...PREPRINT_MOCK });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose enums to the template', () => {
    expect(component.ApplicabilityStatus).toBe(ApplicabilityStatus);
    expect(component.PreregLinkInfo).toBe(PreregLinkInfo);
  });

  it('should reactively update when the preprint input changes', () => {
    expect(component.preprint()).toEqual(PREPRINT_MOCK);

    const updatedMock = { ...PREPRINT_MOCK, id: 'new-id-999' };
    fixture.componentRef.setInput('preprint', updatedMock);

    expect(component.preprint()).toEqual(updatedMock);
  });
});
