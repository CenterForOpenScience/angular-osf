import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@shared/mocks';

import { CompareSectionComponent } from './compare-section.component';

describe('CompareSectionComponent', () => {
  let component: CompareSectionComponent;
  let fixture: ComponentFixture<CompareSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareSectionComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(CompareSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
