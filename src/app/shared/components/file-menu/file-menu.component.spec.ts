import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMenuComponent } from './file-menu.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileMenuComponent', () => {
  let component: FileMenuComponent;
  let fixture: ComponentFixture<FileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileMenuComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
