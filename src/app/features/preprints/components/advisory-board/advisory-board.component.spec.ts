import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryBoardComponent } from './advisory-board.component';

describe('AdvisoryBoardComponent', () => {
  let component: AdvisoryBoardComponent;
  let fixture: ComponentFixture<AdvisoryBoardComponent>;

  const mockHtmlContent =
    '<div class="advisory-content"><h2>Advisory Board</h2><p>This is advisory board content.</p></div>';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdvisoryBoardComponent],
    });

    fixture = TestBed.createComponent(AdvisoryBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getSection(): HTMLElement | null {
    return fixture.nativeElement.querySelector('section');
  }

  it('should have default input values', () => {
    expect(component.htmlContent()).toBeNull();
    expect(component.isLandingPage()).toBe(false);
  });

  it.each([null, undefined])('should not render section when htmlContent is %s', (htmlContent) => {
    fixture.componentRef.setInput('htmlContent', htmlContent);
    fixture.detectChanges();

    expect(getSection()).toBeNull();
  });

  it('should render section when htmlContent is provided', () => {
    fixture.componentRef.setInput('htmlContent', mockHtmlContent);
    fixture.detectChanges();

    const section = getSection();

    expect(section).toBeTruthy();
    expect(section?.innerHTML).toContain('Advisory Board');
    expect(section?.innerHTML).toContain('This is advisory board content.');
  });

  it.each([
    { isLandingPage: false, hasLandingClass: false },
    { isLandingPage: true, hasLandingClass: true },
  ])('should handle landing class when isLandingPage is $isLandingPage', ({ isLandingPage, hasLandingClass }) => {
    fixture.componentRef.setInput('htmlContent', mockHtmlContent);
    fixture.componentRef.setInput('isLandingPage', isLandingPage);
    fixture.detectChanges();

    const section = getSection();

    expect(section).toBeTruthy();
    expect(section?.classList.contains('osf-preprint-service')).toBe(hasLandingClass);
  });
});
