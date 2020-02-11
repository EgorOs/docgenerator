import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseRandomizedComponent } from './base-randomized.component';

describe('BaseRandomizedComponent', () => {
  let component: BaseRandomizedComponent;
  let fixture: ComponentFixture<BaseRandomizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseRandomizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseRandomizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
