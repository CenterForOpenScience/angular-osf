import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryBoardComponent } from './advisory-board.component';

describe('AdvisoryBoardComponent', () => {
  let component: AdvisoryBoardComponent;
  let fixture: ComponentFixture<AdvisoryBoardComponent>;

  const mockHtmlContent =
    '<div class="advisory-content"><h2>Advisory Board</h2><p>This is advisory board content.</p></div>';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvisoryBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvisoryBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.htmlContent()).toBeNull();
    expect(component.brand()).toBeUndefined();
    expect(component.isLandingPage()).toBe(false);
  });

  it('should not render section when htmlContent is null', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const section = compiled.querySelector('section');

    expect(section).toBeNull();
  });

  it('should not render section when htmlContent is undefined', () => {
    fixture.componentRef.setInput('htmlContent', undefined);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const section = compiled.querySelector('section');

    expect(section).toBeNull();
  });

  it('should render section when htmlContent is provided', () => {
    fixture.componentRef.setInput('htmlContent', mockHtmlContent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const section = compiled.querySelector('section');

    expect(section).toBeTruthy();
    expect(section.innerHTML).toBe(mockHtmlContent);
  });

  it('should apply correct CSS classes when isLandingPage is false', () => {
    fixture.componentRef.setInput('htmlContent', mockHtmlContent);
    fixture.componentRef.setInput('isLandingPage', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const section = compiled.querySelector('section');

    expect(section).toBeTruthy();
    expect(section.classList.contains('osf-preprint-service')).toBe(false);
    expect(section.classList.contains('preprints-advisory-board-section')).toBe(true);
    expect(section.classList.contains('pt-3')).toBe(true);
    expect(section.classList.contains('pb-5')).toBe(true);
    expect(section.classList.contains('px-3')).toBe(true);
    expect(section.classList.contains('flex')).toBe(true);
    expect(section.classList.contains('flex-column')).toBe(true);
  });

  it('should apply correct CSS classes when isLandingPage is true', () => {
    fixture.componentRef.setInput('htmlContent', mockHtmlContent);
    fixture.componentRef.setInput('isLandingPage', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const section = compiled.querySelector('section');

    expect(section).toBeTruthy();
    expect(section.classList.contains('osf-preprint-service')).toBe(true);
    expect(section.classList.contains('preprints-advisory-board-section')).toBe(true);
  });
});
