import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintProviderDiscoverComponent } from './preprint-provider-discover.component';

describe('PreprintProviderDiscoverComponent', () => {
  let component: PreprintProviderDiscoverComponent;
  let fixture: ComponentFixture<PreprintProviderDiscoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintProviderDiscoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintProviderDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
