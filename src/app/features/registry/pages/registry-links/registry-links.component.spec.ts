import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryLinksComponent } from './registry-links.component';

describe('RegistryLinksComponent', () => {
  let component: RegistryLinksComponent;
  let fixture: ComponentFixture<RegistryLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryLinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
