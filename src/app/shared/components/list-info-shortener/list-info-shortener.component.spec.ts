import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInfoShortenerComponent } from './list-info-shortener.component';

describe('ListInfoShortenerComponent', () => {
  let component: ListInfoShortenerComponent;
  let fixture: ComponentFixture<ListInfoShortenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListInfoShortenerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListInfoShortenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
