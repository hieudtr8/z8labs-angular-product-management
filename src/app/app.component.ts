import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from "./services/auth.service";
import { Title } from "@angular/platform-browser";
import { ColorModeService, ModalModule } from "@coreui/angular";
import { IconSetService } from "@coreui/icons-angular";
import { iconSubset } from "./icons/icon-subset";
import { delay, filter, map, tap } from 'rxjs/operators';
import { UserPurchaseService } from "./services/user-purchase.service";
import { Subscription } from "rxjs";
import { ModalPurchaseSuccessComponent } from "./components/modal-purchase-success/modal-purchase-success.component";
import { UserPurchase } from "./interfaces/user-purchase";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ModalPurchaseSuccessComponent,
  ],
  template: `
    <router-outlet />

    <app-modal-purchase-success
      [visible]="isVisibleNewUserPurchase"
      [userPurchase]="newUserPurchase"
      (close)="isVisibleNewUserPurchase = false"
    />
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Angular Product Management';

  subscription: Subscription[] = [];
  authService = inject(AuthService);
  userPurchaseService = inject(UserPurchaseService);
  isVisibleNewUserPurchase: boolean = false;
  newUserPurchase: UserPurchase | null = null;

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #titleService = inject(Title);

  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);

  constructor() {
    this.#titleService.setTitle(this.title);
    // iconSet singleton
    this.#iconSetService.icons = { ...iconSubset };
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');
  }

  ngOnInit(): void {

    this.#router.events.pipe(
        takeUntilDestroyed(this.#destroyRef)
      ).subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.#colorModeService.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();

    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.authService.currentUserSig.set({
          id: user.uid,
          email: user.email!,
          username: user.displayName!,
          role: {
            user: true,
            admin: user.email === 'admin@gmail.com'
          }
        })
      } else {
        this.authService.currentUserSig.set(undefined);
      }
    })

    // Listen to socket new user purchase
    this.userPurchaseService.listenToUserPurchases();

    const subscribeToNewUserPurchase = this.userPurchaseService.newUserPurchaseOfCurrentUser$.subscribe((newUserPurchase) => {
      if (newUserPurchase) {
        this.newUserPurchase = newUserPurchase;
        this.isVisibleNewUserPurchase = true;
      }
    });

    this.subscription.push(subscribeToNewUserPurchase)
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }
}
