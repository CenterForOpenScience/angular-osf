import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectAddonComponent } from './connect-addon.component';

describe('ConnectAddonComponent', () => {
  let component: ConnectAddonComponent;
  let fixture: ComponentFixture<ConnectAddonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectAddonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
