import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubHeaderComponent } from '@shared/components';

import { FileDetailComponent } from './file-detail.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('FileDetailComponent', () => {
  let component: FileDetailComponent;
  let fixture: ComponentFixture<FileDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDetailComponent, MockComponent(SubHeaderComponent), OSFTestingStoreModule],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
