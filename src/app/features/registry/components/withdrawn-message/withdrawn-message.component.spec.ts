import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnMessageComponent } from './withdrawn-message.component';

describe.skip('WithdrawnMessageComponent', () => {
  let component: WithdrawnMessageComponent;
  let fixture: ComponentFixture<WithdrawnMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawnMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawnMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
