import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedIdentitiesComponent } from './connected-identities.component';

describe('ConnectedIdentitiesComponent', () => {
  let component: ConnectedIdentitiesComponent;
  let fixture: ComponentFixture<ConnectedIdentitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedIdentitiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectedIdentitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
