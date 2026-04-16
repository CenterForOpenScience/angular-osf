import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { PreprintProviderFooterComponent } from './preprint-provider-footer.component';

describe('PreprintProviderFooterComponent', () => {
  let fixture: ComponentFixture<PreprintProviderFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreprintProviderFooterComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(PreprintProviderFooterComponent);
  });

  it('should render section when footerHtml has content', () => {
    fixture.componentRef.setInput('footerHtml', '<p>Footer</p>');
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section).not.toBeNull();
    expect(section.innerHTML).toContain('Footer');
  });

  it.each([null, undefined, ''])('should not render section when footerHtml is %p', (value) => {
    fixture.componentRef.setInput('footerHtml', value);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('section')).toBeNull();
  });
});
