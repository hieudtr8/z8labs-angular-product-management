import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User, user } from "@angular/fire/auth";
import { from, map, Observable } from "rxjs";
import { SystemUser } from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  isLoggedIn$!: Observable<boolean>;
  currentUserSig = signal<SystemUser | undefined>(undefined);

  private readonly authKey = 'authorizedUser';

  constructor() {
    this.isLoggedIn$ = this.user$.pipe(
      map(user => !!user)
    );

    this.user$.subscribe((user: User | null) => {
      if (user) {
        this.currentUserSig.set({
          email: user.email!,
          username: user.displayName!
        });
      } else {
        this.currentUserSig.set(undefined);
      }
    });
  }

  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(response => {
      updateProfile(response.user, { displayName: username })
      signOut(this.firebaseAuth)
    })

    return from(promise);
  }

  login (email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(response => {
      localStorage.setItem(this.authKey, JSON.stringify(response.user));
    });

    return from(promise);
  }

  logout (): Observable<void> {
    const promise = signOut(this.firebaseAuth);

    return from(promise);
  }
}
