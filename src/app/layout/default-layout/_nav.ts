import { INavData } from '@coreui/angular';

// Navitems for the admin layout
export const navAdminItems: INavData[] = [
  {
    name: 'Dashboard',
    url: 'dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    title: true,
    name: 'Main'
  },
  {
    name: 'Product',
    url: 'products',
    iconComponent: { name: 'cil-cart' },
  },
  {
    name: 'Category',
    url: 'categories',
    iconComponent: { name: 'cil-list' }
  }
];

// Navitems for the user layout
export const navUserItems: INavData[] = [
  {
    title: true,
    name: 'Purchase'
  },
  {
    name: 'Purchase Product',
    url: 'purchase-product',
    iconComponent: { name: 'cil-cart' },
  },
  {
    name: 'Purchase History',
    url: 'purchase-history',
    iconComponent: { name: 'cil-basket' }
  }
]
