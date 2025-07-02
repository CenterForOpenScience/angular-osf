import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryOverviewComponent } from './registry-overview.component';

describe('RegistryOverviewComponent', () => {
  let component: RegistryOverviewComponent;
  let fixture: ComponentFixture<RegistryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
