import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TranslateServiceMock } from '@shared/mocks';

import { AddonsToolbarComponent } from './addons-toolbar.component';

describe('AddonsToolbarComponent', () => {
  let component: AddonsToolbarComponent;
  let fixture: ComponentFixture<AddonsToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonsToolbarComponent],
      providers: [
        TranslateServiceMock,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddonsToolbarComponent);
    fixture.componentRef.setInput('categoryOptions', []);
    fixture.componentRef.setInput('searchControl', new FormControl(''));
    fixture.componentRef.setInput('selectedCategory', '');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
