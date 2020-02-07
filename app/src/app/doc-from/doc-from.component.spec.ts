import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocFromComponent } from './doc-from.component';

describe('DocFromComponent', () => {
  let component: DocFromComponent;
  let fixture: ComponentFixture<DocFromComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocFromComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
