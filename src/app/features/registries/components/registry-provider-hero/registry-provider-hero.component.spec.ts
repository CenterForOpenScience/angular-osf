import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryProviderHeroComponent } from './registry-provider-hero.component';

describe('RegistryProviderHeroComponent', () => {
  let component: RegistryProviderHeroComponent;
  let fixture: ComponentFixture<RegistryProviderHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryProviderHeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryProviderHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
