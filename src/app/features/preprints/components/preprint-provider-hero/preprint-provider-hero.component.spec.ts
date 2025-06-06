import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintProviderHeroComponent } from './preprint-provider-hero.component';

describe('PreprintProviderDescriptionComponent', () => {
  let component: PreprintProviderHeroComponent;
  let fixture: ComponentFixture<PreprintProviderHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintProviderHeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintProviderHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
