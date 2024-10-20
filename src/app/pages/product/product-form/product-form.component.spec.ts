import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormComponent } from './product-form.component';
import { ReactiveFormsModule } from "@angular/forms";
import { ProductService } from "../../../services/product.service";
import { CategoryService } from "../../../services/category.service";
import { FormModule } from "@coreui/angular";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['fetchProducts', 'updateProduct', 'getProduct', 'addProduct', 'products$']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['fetchCategories', 'categories$']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormModule,
        ProductFormComponent
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CategoryService, useValue: mockCategoryService },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: null }) } // Mocking route params as an observable
        },
        { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']) }
      ]
    })
    .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;

    // Mock data for categories
    mockCategoryService.categories$ = of([
      {
        id: '1',
        name: 'Category 1',
        description: 'Category 1 description'
      },
      {
        id: '2',
        name: 'Category 2',
        description: 'Category 2 description'
      }
    ])

    // Mock fetchCategories method to return observable of empty array
    mockCategoryService.fetchCategories.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should initialize form with default values', () => {
    expect(component).toBeTruthy();
    const form = component.productForm;

    expect(form.value).toEqual({
      name: '',
      price: '',
      description: '',
      categoryId: null
    });
  });

  // check form invalid when empty
  it('should sow err message if name field is touched and invalid', () => {
    const nameInput = fixture.debugElement.query(By.css('input[formControlName="name"]'));
    nameInput.triggerEventHandler('blur', null); // simulate losing focus
    fixture.detectChanges();

    const errorMessages = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessages.nativeElement.textContent).toContain('Name is required.');
  });

  // Check add product method is called on submit
  it('should call the productService to add new product on submit', () => {
    component.productForm.setValue({
      name: 'Product 1',
      price: 100,
      description: 'Product 1 description',
      categoryId: '1'
    });

    mockProductService.addProduct.and.returnValue(of({
      id: '1',
      name: 'Product 1',
      price: 100,
      description: 'Product 1 description',
      categoryId: '1'
    }));

    component.onSubmit();
    expect(mockProductService.addProduct).toHaveBeenCalled();
  })

  // Check update product method is called on submit
  it('should update product when in edit mode', async () => {
    const mockProductId = '1';

    const routerSpy = spyOn((component as any).router, 'navigate').and.stub();

    // Set the mock route params to simulate edit mode with a valid product ID
    const mockActivatedRoute = TestBed.inject(ActivatedRoute);
    (mockActivatedRoute as any).params = of({ id: mockProductId }); // Mock the params observable

    (component as any).isEditMode = true;
    component.productId = mockProductId;

    // Mock existing product data
    const mockProduct = {
      id: mockProductId,
      name: 'Product 1',
      price: 100,
      description: 'Product 1 description',
      categoryId: '1',
    };

    // Mock the service to return the existing product
    mockProductService.getProduct.and.returnValue(of(mockProduct));

    // Trigger ngOnInit to load the product
    component.ngOnInit();
    fixture.detectChanges(); // Update the DOM

    // Wait for async operations to complete
    await fixture.whenStable();

    // Check that the form was populated with the existing product data
    expect(component.productForm.value).toEqual({
      name: 'Product 1',
      price: 100,
      description: 'Product 1 description',
      categoryId: '1',
    });

    // Update the product data
    component.productForm.setValue({
      name: 'Product 2',
      price: 200,
      description: 'Product 2 description',
      categoryId: '2',
    });

    // Mock the updateProduct method to return the updated product
    mockProductService.updateProduct.and.returnValue(of({
      ...mockProduct,
      name: 'Product 2',
      price: 200,
      description: 'Product 2 description',
      categoryId: '2',
    }));

    // Trigger the submit method
    component.onSubmit();

    // Check that the updateProduct method was called with the updated product data
    expect(mockProductService.updateProduct).toHaveBeenCalledWith({
      id: mockProductId,
      name: 'Product 2',
      price: 200,
      description: 'Product 2 description',
      categoryId: '2',
    }, undefined);

    expect(routerSpy).toHaveBeenCalledWith(['/products']);
  });

});
