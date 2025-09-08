import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSecondaryMetadataComponent } from './user-secondary-metadata.component';

describe.skip('UserSecondaryMetadataComponent', () => {
  let component: UserSecondaryMetadataComponent;
  let fixture: ComponentFixture<UserSecondaryMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSecondaryMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSecondaryMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
