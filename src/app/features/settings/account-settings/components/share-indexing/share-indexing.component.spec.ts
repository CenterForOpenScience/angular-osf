import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareIndexingComponent } from './share-indexing.component';

describe('ShareIndexingComponent', () => {
  let component: ShareIndexingComponent;
  let fixture: ComponentFixture<ShareIndexingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareIndexingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareIndexingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
