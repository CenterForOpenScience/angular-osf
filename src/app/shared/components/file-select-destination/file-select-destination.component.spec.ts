import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from '../select/select.component';

import { FileSelectDestinationComponent } from './file-select-destination.component';

describe.skip('FileSelectDestinationComponent', () => {
  let component: FileSelectDestinationComponent;
  let fixture: ComponentFixture<FileSelectDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileSelectDestinationComponent, MockComponent(SelectComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(FileSelectDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
