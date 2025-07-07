import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataResourcesComponent } from './data-resources.component';

describe('DataResourcesComponent', () => {
  let component: DataResourcesComponent;
  let fixture: ComponentFixture<DataResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataResourcesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
