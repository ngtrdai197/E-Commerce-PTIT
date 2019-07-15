import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashCategoryComponent } from './dash-category.component';

describe('DashCategoryComponent', () => {
  let component: DashCategoryComponent;
  let fixture: ComponentFixture<DashCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
