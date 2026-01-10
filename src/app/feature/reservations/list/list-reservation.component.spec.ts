import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReservationComponent } from './list-reservation.component';

describe('ListReservationComponent', () => {
  let component: ListReservationComponent;
  let fixture: ComponentFixture<ListReservationComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListReservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListReservationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
