import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    title: true,
    name: 'Main'
  },
  {
    name: 'Product',
    url: '/products',
    iconComponent: { name: 'cil-cart' },
  },
  {
    name: 'Category',
    url: '/categories',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-list' }
  }
];
