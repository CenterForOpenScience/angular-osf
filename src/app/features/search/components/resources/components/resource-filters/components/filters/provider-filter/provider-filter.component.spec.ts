import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderFilterComponent } from './provider-filter.component';

describe('ProviderFilterComponent', () => {
  let component: ProviderFilterComponent;
  let fixture: ComponentFixture<ProviderFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
