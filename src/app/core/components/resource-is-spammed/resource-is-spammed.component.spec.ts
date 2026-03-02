import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ResourceIsSpammedComponent } from './resource-is-spammed.component';

describe('ResourceIsSpammedComponent', () => {
  let component: ResourceIsSpammedComponent;
  let fixture: ComponentFixture<ResourceIsSpammedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ResourceIsSpammedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceIsSpammedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
