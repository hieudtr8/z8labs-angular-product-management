import { inject, Injectable } from "@angular/core";
import { collection, collectionData, doc, Firestore, setDoc, Timestamp } from "@angular/fire/firestore";
import { UserPurchase } from "../interfaces/user-purchase";
import { BehaviorSubject, catchError, combineLatest, filter, from, map, Observable, of, tap, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { ProductService } from "./product.service";

@Injectable({
  providedIn: 'root',
})
export class UserPurchaseService {
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  private productsService = inject(ProductService);

  private userPurchasesSubject = new BehaviorSubject<UserPurchase[]>([]);
  public userPurchases$ = this.userPurchasesSubject.asObservable();

  constructor() {}

  // Fetch list of user purchases of current user
  fetchUserPurchases(): Observable<UserPurchase[]> {
    if (this.userPurchasesSubject.value.length > 0) {
      return of(this.userPurchasesSubject.value);
    }

    const userPurchasesCollection = collection(this.firestore, 'user-purchases');
    const currentUserId = this.authService.currentUserSig()?.id;

    return collectionData(userPurchasesCollection, { idField: 'id'}).pipe(
      // Use map to filter the array of user purchases
      map((userPurchases: UserPurchase[]) => {
        const afterFilter = userPurchases.filter(userPurchase => {
          // convert createdAt from timestampt to a Date object
          userPurchase.createdAt = (userPurchase.createdAt as Timestamp).toDate();
          return userPurchase.userId === currentUserId;
        });
        // sort by createdAt in descending order
        return afterFilter.sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());

      }),
      tap((userPurchases: UserPurchase[]) => this.userPurchasesSubject.next(userPurchases)),
      catchError(error =>  throwError(() => new Error(error)))

    );
  }

  // Fetch list of user purchases with product details
  fetchUserPurchasesWithProducts(): Observable<UserPurchase[]> {
    return combineLatest([
      this.fetchUserPurchases(),
      this.productsService.fetchProducts()
    ]).pipe(
      map(([userPurchases, products]) => {
        return userPurchases.map(userPurchase => {
          const product = products.find(product => product.id === userPurchase.productId);
          return {
            ...userPurchase,
            productName: product?.name || 'Unknown',
          };
        }
      )})
    );
  }

  // User purchase new product
  purchaseProduct(userPurchase: UserPurchase): Observable<UserPurchase> {
    const userPurchaseId = doc(collection(this.firestore, 'user-purchases')).id;
    const newUserPurchase = {
      id: userPurchaseId,
      ...userPurchase
    };

    return from(setDoc(doc(this.firestore, 'user-purchases', userPurchaseId), newUserPurchase)).pipe(
      tap(() => {
        const currentPurchases = this.userPurchasesSubject.value;
        this.userPurchasesSubject.next([...currentPurchases, newUserPurchase]);
      }),
      map(() => newUserPurchase),
      catchError(error => throwError(() => new Error(error)))
    );
  }

  // Reupdate user purchases state
  updateUserPurchases(userPurchases: UserPurchase[]): Observable<UserPurchase[]> {
    this.userPurchasesSubject.next(userPurchases);
    return of(userPurchases);
  }
}
