import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokensComponent } from './tokens.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe.skip('TokensComponent', () => {
  let component: TokensComponent;
  let fixture: ComponentFixture<TokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokensComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
