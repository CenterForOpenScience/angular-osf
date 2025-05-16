import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TermsOfUseComponent } from './terms-of-use.component';

describe('TermsOfUseComponent', () => {
  let component: TermsOfUseComponent;
  let fixture: ComponentFixture<TermsOfUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsOfUseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsOfUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the main title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent).toContain('CENTER FOR OPEN SCIENCE, INC.');
    expect(title.nativeElement.textContent).toContain('TERMS AND CONDITIONS OF USE');
  });

  it('should render all major sections', () => {
    const sections = fixture.debugElement.queryAll(By.css('section'));
    expect(sections.length).toBeGreaterThan(0);

    const sectionTitles = sections.map((section) => section.query(By.css('h2'))?.nativeElement.textContent);

    expect(sectionTitles).toContain('1. INTRODUCTION');
    expect(sectionTitles).toContain('2. TERMS OF USE');
    expect(sectionTitles).toContain('3. MODIFICATIONS TO THESE TERMS OF USE');
  });

  it('should render links with correct attributes', () => {
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBeGreaterThan(0);

    const privacyPolicyLink = links.find((link) => link.nativeElement.textContent.includes('Privacy Policy'));
    expect(privacyPolicyLink).toBeTruthy();
    expect(privacyPolicyLink?.nativeElement.href).toContain('PRIVACY_POLICY.md');

    const contactLink = links.find((link) => link.nativeElement.textContent.includes('contact@cos.io'));
    expect(contactLink).toBeTruthy();
    expect(contactLink?.nativeElement.href).toContain('mailto:contact@cos.io');
  });
});
