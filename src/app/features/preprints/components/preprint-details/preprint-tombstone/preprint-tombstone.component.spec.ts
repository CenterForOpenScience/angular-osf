import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintTombstoneComponent } from './preprint-tombstone.component';

describe.skip('PreprintTombstoneComponent', () => {
  let component: PreprintTombstoneComponent;
  let fixture: ComponentFixture<PreprintTombstoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintTombstoneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintTombstoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
