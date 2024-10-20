import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFormComponent } from './category-form.component';
import { CategoryService } from "../../../services/category.service";
import { ProductService } from "../../../services/product.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { of } from "rxjs";

describe('CategoryFormComponent', () => {
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['fetchProducts', 'updateProducts', 'getProduct']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getCategory', 'updateCategory', 'addCategory']);

    await TestBed.configureTestingModule({
      imports: [CategoryFormComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']) },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: null }) } // Mocking route params as an observable
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default value', () => {
    expect(component.categoryForm).toBeTruthy();
    expect(component.isEditMode).toBeFalse();
    expect(component.categoryId).toBeUndefined();

    const formValue = component.categoryForm.value;

    expect(formValue.name).toEqual('');
    expect(formValue.description).toEqual('');
  });

  it('should shpw err message if name is empty', () => {
    const name = component.categoryForm.get('name');
    name?.setValue('');
    expect(name?.hasError('required')).toBeTrue();
  });

  it('should call categoryService to add category', () => {
    const category = {
      name: 'Category 1',
      description: 'Category 1 description'
    };

    component.categoryForm.setValue(category);

    mockCategoryService.addCategory.and.returnValue(of(category));

    component.onSubmit();
    expect(mockCategoryService.addCategory).toHaveBeenCalledWith(category);
  });

  it('should update category when in edit mode', () => {
    const mockCategoryId = '1';

    const routerSpy = spyOn((component as any).router, 'navigate').and.stub();

    const mockActiveRoute = TestBed.inject(ActivatedRoute);
    (mockActiveRoute as any).params = of({ id: mockCategoryId });

    (component as any).isEditMode = true;
    component.categoryId = mockCategoryId;

    // Mock existing category
    const mockCategory = {
      name: 'Category 1',
      description: 'Category 1 description'
    };

    // Mock the service to return the existing category
    mockCategoryService.getCategory.and.returnValue(of(mockCategory));

    // Trigger load category
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.categoryForm.value).toEqual(mockCategory);

    // Update the category
    component.categoryForm.setValue({
      name: 'Category 2',
      description: 'Category 2 description'
    });

    // Mock the service to return the updated category
    mockCategoryService.updateCategory.and.returnValue(of({
      ...mockCategory,
      name: 'Category 2',
      description: 'Category 2 description'
    }));

    // Trigger the submit method
    component.onSubmit();

    expect(mockCategoryService.updateCategory).toHaveBeenCalledWith({
      id: mockCategoryId,
      name: 'Category 2',
      description: 'Category 2 description'
    });

    expect(routerSpy).toHaveBeenCalledWith(['/categories']);
  });
});
