import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAndDownloadComponent } from './share-and-download.component';

describe('ShareAndDownlaodComponent', () => {
  let component: ShareAndDownloadComponent;
  let fixture: ComponentFixture<ShareAndDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareAndDownloadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareAndDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
