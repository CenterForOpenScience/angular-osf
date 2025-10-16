import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesContainerComponent } from './files-container.component';

describe('FilesContainerComponent', () => {
  let component: FilesContainerComponent;
  let fixture: ComponentFixture<FilesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be an instance of FilesContainerComponent', () => {
    expect(component).toBeInstanceOf(FilesContainerComponent);
  });

  it('should render router-outlet', () => {
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should have only router-outlet in template', () => {
    const children = fixture.nativeElement.children;
    expect(children.length).toBe(1);
    expect(children[0].tagName.toLowerCase()).toBe('router-outlet');
  });

  it('should have no custom input properties', () => {
    const customProperties = Object.keys(component).filter((key) => !key.startsWith('__'));
    expect(customProperties).toEqual([]);
  });

  it('should have no output properties', () => {
    const outputs = Object.getOwnPropertyNames(Object.getPrototypeOf(component)).filter(
      (prop) => prop.startsWith('on') || prop.endsWith('$')
    );
    expect(outputs).toEqual([]);
  });

  it('should be a simple container component', () => {
    expect(component).toBeDefined();
    expect(typeof component).toBe('object');
  });
});
