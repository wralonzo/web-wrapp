import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserComponponent } from './edit.component';

describe('Edit', () => {
  let component: EditUserComponponent;
  let fixture: ComponentFixture<EditUserComponponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserComponponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserComponponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
