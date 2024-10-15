import { Component, OnInit } from '@angular/core';
import { Product } from "../../../interfaces/product";
import { ProductService } from "../../../shared/services/product.service";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe((products) => this.products = products);
  }
}
