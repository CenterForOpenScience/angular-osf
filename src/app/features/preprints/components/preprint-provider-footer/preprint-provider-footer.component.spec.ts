import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintProviderFooterComponent } from './preprint-provider-footer.component';

describe('PreprintProviderFooterComponent', () => {
  let component: PreprintProviderFooterComponent;
  let fixture: ComponentFixture<PreprintProviderFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintProviderFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintProviderFooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('footerHtml', '');
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should not render section when footerHtml is null', () => {
    fixture.componentRef.setInput('footerHtml', null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const section = compiled.querySelector('section');

    expect(section).toBeNull();
  });

  it('should not render section when footerHtml is undefined', () => {
    fixture.componentRef.setInput('footerHtml', undefined);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const section = compiled.querySelector('section');

    expect(section).toBeNull();
  });

  it('should not render section when footerHtml is empty string', () => {
    fixture.componentRef.setInput('footerHtml', '');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const section = compiled.querySelector('section');

    expect(section).toBeNull();
  });
});
