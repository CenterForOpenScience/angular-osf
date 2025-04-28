import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenCreatedDialogComponent } from './token-created-dialog.component';

describe('TokenCreatedDialogComponent', () => {
  let component: TokenCreatedDialogComponent;
  let fixture: ComponentFixture<TokenCreatedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenCreatedDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenCreatedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
