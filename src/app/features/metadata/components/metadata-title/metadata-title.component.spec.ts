import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@osf/shared/mocks';

import { MetadataTitleComponent } from './metadata-title.component';

describe('MetadataTitleComponent', () => {
  let component: MetadataTitleComponent;
  let fixture: ComponentFixture<MetadataTitleComponent>;

  const mockTitle = 'Title';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataTitleComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataTitleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title input', () => {
    fixture.componentRef.setInput('title', mockTitle);
    fixture.detectChanges();

    expect(component.title()).toEqual(mockTitle);
  });

  it('should emit openEditTitleDialog event', () => {
    const emitSpy = jest.spyOn(component.openEditTitleDialog, 'emit');

    component.openEditTitleDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
