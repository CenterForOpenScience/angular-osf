import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { InfoIconComponent } from '../info-icon/info-icon.component';

import { ComponentCheckboxItemComponent } from './component-checkbox-item.component';

describe('ComponentCheckboxItemComponent', () => {
  let component: ComponentCheckboxItemComponent;
  let fixture: ComponentFixture<ComponentCheckboxItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComponentCheckboxItemComponent, MockComponent(InfoIconComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(ComponentCheckboxItemComponent);
    fixture.componentRef.setInput('item', { id: '1', name: 'Test Item', checked: false });
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
