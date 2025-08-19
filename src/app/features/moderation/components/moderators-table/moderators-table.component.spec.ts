import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from '@shared/components';
import { TranslateServiceMock } from '@shared/mocks';

import { ModeratorsTableComponent } from './moderators-table.component';

describe('ModeratorsTableComponent', () => {
  let component: ModeratorsTableComponent;
  let fixture: ComponentFixture<ModeratorsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorsTableComponent, MockComponent(SelectComponent), MockPipe(TranslatePipe)],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ModeratorsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
