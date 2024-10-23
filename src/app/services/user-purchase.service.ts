import { inject, Injectable } from "@angular/core";
import { collection, collectionData, doc, Firestore, setDoc, Timestamp } from "@angular/fire/firestore";
import { UserPurchase } from "../interfaces/user-purchase";
import { BehaviorSubject, catchError, combineLatest, filter, from, map, Observable, of, Subscription, tap, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { ProductService } from "./product.service";

@Injectable({
  providedIn: 'root',
})
export class UserPurchaseService {
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);

  // Store user purchases of current user
  private userPurchasesCurrentUserSubject = new BehaviorSubject<UserPurchase[]>([]);
  public userPurchasesCurrentUser$ = this.userPurchasesCurrentUserSubject.asObservable();
  // Store all user purchases
  private allUserPurchasesSubject = new BehaviorSubject<UserPurchase[]>([]);
  public allUserPurchases$ = this.allUserPurchasesSubject.asObservable();

  constructor() {
    // Clear user purchases state when user logs out
    this.authService.isLoggedIn$.subscribe(() => this.userPurchasesCurrentUserSubject.next([]));
  }

  // Fetch list of user purchases of current user
  fetchUserPurchasesOfCurrentUser(): Observable<UserPurchase[]> {
    const userPurchasesCollection = collection(this.firestore, 'user-purchases');
    const currentUser = this.authService.currentUserSig();

    if (!currentUser) return throwError(() => new Error('User not signed in'));

    const currentUserId = currentUser.id;

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
      tap((userPurchases: UserPurchase[]) => this.userPurchasesCurrentUserSubject.next(userPurchases)),
      catchError(error =>  throwError(() => new Error(error)))
    );
  }

  // Fetch list of all user purchases
  fetchAllUserPurchases(): Observable<UserPurchase[]> {
    const userPurchasesCollection = collection(this.firestore, 'user-purchases');

    return collectionData(userPurchasesCollection, { idField: 'id'}).pipe(
      map((userPurchases: UserPurchase[]) => {
        // convert createdAt from timestampt to a Date object
        userPurchases.forEach(userPurchase => {
          userPurchase.createdAt = (userPurchase.createdAt as Timestamp).toDate();
        });
        // sort by createdAt in descending order
        userPurchases.sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
        return userPurchases;
      }),
      tap((userPurchases: UserPurchase[]) => this.allUserPurchasesSubject.next(userPurchases)),
      catchError(error =>  throwError(() => new Error(error)))
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
        const currentPurchases = this.userPurchasesCurrentUserSubject.value;
        this.userPurchasesCurrentUserSubject.next([...currentPurchases, newUserPurchase]);
        this.allUserPurchasesSubject.next([...this.allUserPurchasesSubject.value, newUserPurchase]);
      }),
      map(() => newUserPurchase),
      catchError(error => throwError(() => new Error(error)))
    );
  }

  // Reupdate current user's user purchases state
  updateCurrentUserUserPurchases(userPurchases: UserPurchase[]): Observable<UserPurchase[]> {
    this.userPurchasesCurrentUserSubject.next(userPurchases);
    return of(userPurchases);
  }

  // Reupdate all user purchases state
  updateAllUserPurchases(userPurchases: UserPurchase[]): Observable<UserPurchase[]> {
    this.allUserPurchasesSubject.next(userPurchases);
    return of(userPurchases);
  }
}
