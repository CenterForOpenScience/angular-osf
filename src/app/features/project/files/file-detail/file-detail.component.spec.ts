import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { FileDetailComponent } from './file-detail.component';

describe('FileDetailComponent', () => {
  let component: FileDetailComponent;
  let fixture: ComponentFixture<FileDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDetailComponent],
      providers: [MockProvider(ActivatedRoute)],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
