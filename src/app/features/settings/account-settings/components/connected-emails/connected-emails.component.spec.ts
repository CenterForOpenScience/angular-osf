import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedEmailsComponent } from './connected-emails.component';

describe('ConnectedEmailsComponent', () => {
  let component: ConnectedEmailsComponent;
  let fixture: ComponentFixture<ConnectedEmailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedEmailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectedEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
