import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsManagementComponent } from './order-details-management.component';

describe('OrderDetailsManagementComponent', () => {
  let component: OrderDetailsManagementComponent;
  let fixture: ComponentFixture<OrderDetailsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
