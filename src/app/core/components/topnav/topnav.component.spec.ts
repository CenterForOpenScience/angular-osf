import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMenuComponent } from '../nav-menu/nav-menu.component';

import { TopnavComponent } from './topnav.component';

describe('TopnavComponent', () => {
  let component: TopnavComponent;
  let fixture: ComponentFixture<TopnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopnavComponent, MockComponent(NavMenuComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(TopnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
