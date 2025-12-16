import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewSupplementsComponent } from './overview-supplements.component';

import { MOCK_NODE_PREPRINTS } from '@testing/mocks/node-preprint.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('OverviewSupplementsComponent', () => {
  let component: OverviewSupplementsComponent;
  let fixture: ComponentFixture<OverviewSupplementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewSupplementsComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewSupplementsComponent);
    component = fixture.componentInstance;
  });

  it('should default isLoading to false', () => {
    fixture.componentRef.setInput('supplements', []);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
  });

  it('should display skeleton when isLoading is true', () => {
    fixture.componentRef.setInput('supplements', MOCK_NODE_PREPRINTS);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('p-skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('should display supplements list when isLoading is false and supplements exist', () => {
    fixture.componentRef.setInput('supplements', MOCK_NODE_PREPRINTS);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('p-skeleton');
    const paragraphs = fixture.nativeElement.querySelectorAll('p');

    expect(skeleton).toBeFalsy();
    expect(paragraphs.length).toBeGreaterThan(0);
  });

  it('should display empty message when isLoading is false and supplements array is empty', () => {
    fixture.componentRef.setInput('supplements', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('p-skeleton');
    const paragraphs = fixture.nativeElement.querySelectorAll('p');

    expect(skeleton).toBeFalsy();
    expect(paragraphs.length).toBe(1);
  });

  it('should display each supplement with title, formatted date, and link', () => {
    fixture.componentRef.setInput('supplements', MOCK_NODE_PREPRINTS);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links.length).toBe(MOCK_NODE_PREPRINTS.length);

    links.forEach((link: HTMLAnchorElement, index: number) => {
      expect(link.href).toBe(MOCK_NODE_PREPRINTS[index].url);
      expect(link.textContent).toContain(MOCK_NODE_PREPRINTS[index].title);
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });
});
