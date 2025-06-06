import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintProviderFooterComponent } from './preprint-provider-footer.component';

describe('PreprintProviderFooterComponent', () => {
  let component: PreprintProviderFooterComponent;
  let fixture: ComponentFixture<PreprintProviderFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintProviderFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintProviderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
