import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHelpTutorialComponent } from './search-help-tutorial.component';

describe('SearchHelpTutorialComponent', () => {
  let component: SearchHelpTutorialComponent;
  let fixture: ComponentFixture<SearchHelpTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchHelpTutorialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchHelpTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
