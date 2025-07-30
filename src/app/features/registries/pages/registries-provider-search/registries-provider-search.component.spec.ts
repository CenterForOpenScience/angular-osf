import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesProviderSearchComponent } from './registries-provider-search.component';

describe('RegistriesProviderSearchComponent', () => {
  let component: RegistriesProviderSearchComponent;
  let fixture: ComponentFixture<RegistriesProviderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistriesProviderSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesProviderSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
