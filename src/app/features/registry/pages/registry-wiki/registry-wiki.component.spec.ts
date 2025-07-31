import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryWikiComponent } from './registry-wiki.component';

describe('RegistryWikiComponent', () => {
  let component: RegistryWikiComponent;
  let fixture: ComponentFixture<RegistryWikiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryWikiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
