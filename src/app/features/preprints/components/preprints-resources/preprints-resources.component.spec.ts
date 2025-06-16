import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsResourcesComponent } from './preprints-resources.component';

describe('PreprintsResourcesComponent', () => {
  let component: PreprintsResourcesComponent;
  let fixture: ComponentFixture<PreprintsResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsResourcesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
