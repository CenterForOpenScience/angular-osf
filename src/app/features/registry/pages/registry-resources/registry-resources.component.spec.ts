import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryResourcesComponent } from './registry-resources.component';

describe('RegistryResourcesComponent', () => {
  let component: RegistryResourcesComponent;
  let fixture: ComponentFixture<RegistryResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryResourcesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
