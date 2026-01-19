import { TranslateModule } from '@ngx-translate/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { Funder } from '@osf/features/metadata/models';

import { FunderAwardsListComponent } from './funder-awards-list.component';

describe('FunderAwardsListComponent', () => {
  let component: FunderAwardsListComponent;
  let fixture: ComponentFixture<FunderAwardsListComponent>;

  const MOCK_REGISTRY_ID = 'test-registry-123';
  const MOCK_FUNDERS: Funder[] = [
    {
      funderName: 'National Science Foundation',
      awardNumber: 'NSF-2024-X',
      funderIdentifier: '10.13039/100000001',
      funderIdentifierType: 'Crossref Funder ID',
      awardUri: 'https://nsf.gov/award/1',
      awardTitle: 'Advanced Research Initiative',
    },
    {
      funderName: 'European Research Council',
      awardNumber: 'ERC-888',
      funderIdentifier: '10.13039/501100000781',
      funderIdentifierType: 'Crossref Funder ID',
      awardUri: 'https://erc.europa.eu/award/2',
      awardTitle: 'Future Fellowship',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunderAwardsListComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FunderAwardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render the list or label if funders array is empty', () => {
    fixture.componentRef.setInput('funders', []);
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('p'));
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(label).toBeNull();
    expect(links.length).toBe(0);
  });

  it('should render a list of funders when data is provided', () => {
    fixture.componentRef.setInput('funders', MOCK_FUNDERS);
    fixture.componentRef.setInput('registryId', MOCK_REGISTRY_ID);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBe(2);
    const firstItemText = links[0].nativeElement.textContent;
    expect(firstItemText).toContain('National Science Foundation');
    expect(firstItemText).toContain('NSF-2024-X');
  });

  it('should generate the correct router link', () => {
    fixture.componentRef.setInput('funders', MOCK_FUNDERS);
    fixture.componentRef.setInput('registryId', MOCK_REGISTRY_ID);
    fixture.detectChanges();
    const linkDebugEl = fixture.debugElement.query(By.css('a'));
    const href = linkDebugEl.nativeElement.getAttribute('href');
    expect(href).toContain(`/${MOCK_REGISTRY_ID}/metadata/osf`);
  });

  it('should open links in a new tab', () => {
    fixture.componentRef.setInput('funders', MOCK_FUNDERS);
    fixture.detectChanges();
    const linkDebugEl = fixture.debugElement.query(By.css('a'));
    expect(linkDebugEl.attributes['target']).toBe('_blank');
  });
});
