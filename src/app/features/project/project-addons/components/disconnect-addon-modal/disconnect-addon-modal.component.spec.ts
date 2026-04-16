import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { DisconnectAddonModalComponent } from './disconnect-addon-modal.component';

describe.skip('DisconnectAddonModalComponent', () => {
  let component: DisconnectAddonModalComponent;
  let fixture: ComponentFixture<DisconnectAddonModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DisconnectAddonModalComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(DisconnectAddonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
