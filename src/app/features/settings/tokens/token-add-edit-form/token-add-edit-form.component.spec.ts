import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenAddEditFormComponent } from './token-add-edit-form.component';

describe('CreateTokenComponent', () => {
  let component: TokenAddEditFormComponent;
  let fixture: ComponentFixture<TokenAddEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenAddEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenAddEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
