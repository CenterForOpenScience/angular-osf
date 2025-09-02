import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOnlyLinkMessageComponent } from './view-only-link-message.component';

describe('ViewOnlyLinkMessageComponent', () => {
  let component: ViewOnlyLinkMessageComponent;
  let fixture: ComponentFixture<ViewOnlyLinkMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOnlyLinkMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOnlyLinkMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
