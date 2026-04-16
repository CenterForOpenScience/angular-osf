import { MockPipe } from 'ng-mocks';

import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationFormatPipe } from '@shared/pipes/citation-format.pipe';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { CitationPreviewComponent } from './citation-preview.component';

describe('CitationPreviewComponent', () => {
  let component: CitationPreviewComponent;
  let componentRef: ComponentRef<CitationPreviewComponent>;
  let fixture: ComponentFixture<CitationPreviewComponent>;

  const mockUser = MOCK_USER;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CitationPreviewComponent, MockPipe(CitationFormatPipe)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(CitationPreviewComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('currentUser', mockUser);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
