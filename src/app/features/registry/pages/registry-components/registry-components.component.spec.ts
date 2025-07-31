import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryComponentsComponent } from './registry-components.component';

describe('RegistryComponentsComponent', () => {
  let component: RegistryComponentsComponent;
  let fixture: ComponentFixture<RegistryComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryComponentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
