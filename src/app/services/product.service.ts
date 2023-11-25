import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private baseUrl = "http://localhost:8080/api";
  
  constructor(private httpClient: HttpClient) { }
  
  getProductDetails(productId: number):Observable<Product> {
    const productUrl = `${this.baseUrl}/products/${productId}`; 

    return this.httpClient.get<Product>(productUrl);
  }

  searchProductsPaginate(thePage:number, 
                        thePageSize:number, 
                        keyword: string): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/products/search/findByNameContaining?name=${keyword}`
                      + `&page=${thePage}&size=${thePageSize}`;  

        return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/products/search/findByNameContaining?name=${keyword}`; 

    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage:number, 
                        thePageSize:number, 
                        categoryId:number): Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}`
                    + `&page=${thePage}&size=${thePageSize}`; 

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId:number): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}`; 

    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategories>(this.baseUrl + '/product-category').pipe(
      map(response => response._embedded.productCategory)
    );
  }
}

interface GetResponseProducts{
  _embedded: {
    products: Product[];
  },
  page:{
    size: number,
    totalElements: number;
    totalPages: number;
    number: number;
  }
}

interface GetResponseProductCategories{
  _embedded: {
    productCategory: ProductCategory[];
  }
}