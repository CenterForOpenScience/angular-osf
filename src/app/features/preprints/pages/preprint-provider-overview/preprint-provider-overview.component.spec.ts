import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintProviderOverviewComponent } from './preprint-provider-overview.component';

describe('ProviderOverviewComponent', () => {
  let component: PreprintProviderOverviewComponent;
  let fixture: ComponentFixture<PreprintProviderOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintProviderOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintProviderOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
