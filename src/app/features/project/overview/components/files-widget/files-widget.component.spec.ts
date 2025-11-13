import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesTreeComponent } from '@osf/shared/components/files-tree/files-tree.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';

import { FilesWidgetComponent } from './files-widget.component';

describe.skip('FilesWidgetComponent', () => {
  let component: FilesWidgetComponent;
  let fixture: ComponentFixture<FilesWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesWidgetComponent, ...MockComponents(SelectComponent, FilesTreeComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
