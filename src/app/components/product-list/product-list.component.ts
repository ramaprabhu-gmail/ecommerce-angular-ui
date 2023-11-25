import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = 'Books';
  searchMode: boolean = false;
  keyword: string = '';
  previousKeyword: string = '';

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;


  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {

      this.listProducts();
    })
  }

  listProducts() {
    console.log('listProducts');

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else
      this.handleListProducts();
  }

  handleSearchProducts() {

    this.keyword = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous
    // then reset thePageNumber back to 1
    if (this.previousKeyword != this.keyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = this.keyword;

    // spring data rest page numbers start with 0 hence doing -1
    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, this.keyword)
      .subscribe(this.processResult());
  }



  handleListProducts() {
    // check if the id paramter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the id param string and convert it to number using + symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    console.log('currentCategoryName ' + this.currentCategoryName);

    // check if we have a different category from previous
    // Note: Angular  will reuse a component if it is currently being viewed.

    // if we have a different category id than previous
    // then reset thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    // spring data rest page numbers start with 0 hence doing -1
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize, this.currentCategoryId)
      .subscribe(this.processResult());
  }

  updatePageSize(myPageSize: string) {
    this.thePageSize = +myPageSize;
    this.thePageNumber = 1;
    console.log('updatePageSize');
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1; // to offset from spring data rest page number
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCard(product: Product) {
    
    console.log(`Adding to cart ${product.name} ${product.unitPrice}`)
  }

}
