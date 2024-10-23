import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPurchaseSuccessComponent } from './modal-purchase-success.component';

describe('ModalPurchaseSuccessComponent', () => {
  let component: ModalPurchaseSuccessComponent;
  let fixture: ComponentFixture<ModalPurchaseSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPurchaseSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPurchaseSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
