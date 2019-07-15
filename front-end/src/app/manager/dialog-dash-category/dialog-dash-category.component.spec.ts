import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDashCategoryComponent } from './dialog-dash-category.component';

describe('DialogDashCategoryComponent', () => {
  let component: DialogDashCategoryComponent;
  let fixture: ComponentFixture<DialogDashCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDashCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDashCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
