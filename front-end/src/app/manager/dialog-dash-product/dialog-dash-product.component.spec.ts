import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDashProductComponent } from './dialog-dash-product.component';

describe('DialogDashProductComponent', () => {
  let component: DialogDashProductComponent;
  let fixture: ComponentFixture<DialogDashProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDashProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDashProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
