import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseProductComponent } from './purchase-product.component';

describe('PurchaseProductComponent', () => {
  let component: PurchaseProductComponent;
  let fixture: ComponentFixture<PurchaseProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
