// Textos esperados nas telas da SauceDemo, conferidos no código-fonte oficial
// (github.com/saucelabs/sample-app-web) e na versão publicada em www.saucedemo.com
export const TEXTS = {
  BROWSER_TITLE: 'Swag Labs',
  LOGO: 'Swag Labs',

  LOGIN: {
    USERNAME_PLACEHOLDER: 'Username',
    PASSWORD_PLACEHOLDER: 'Password',
    BUTTON: 'Login',
    ACCEPTED_USERNAMES: 'Accepted usernames are:',
    PASSWORD_FOR_ALL_USERS: 'Password for all users:',
  },

  INVENTORY: {
    TITLE: 'Products',
    TOTAL_PRODUCTS: 6,
    DEFAULT_SORT: 'Name (A to Z)',
    SORT_OPTIONS: ['Name (A to Z)', 'Name (Z to A)', 'Price (low to high)', 'Price (high to low)'],
  },

  PRODUCT_DETAILS: {
    BACK_BUTTON: 'Back to products',
  },

  BUTTONS: {
    ADD_TO_CART: 'Add to cart',
    REMOVE: 'Remove',
  },

  MENU_ITEMS: ['All Items', 'Dynamic Catalog', 'About', 'Logout', 'Reset App State'],

  CART: {
    TITLE: 'Your Cart',
    CHECKOUT_BUTTON: 'Checkout',
    CONTINUE_SHOPPING_BUTTON: 'Continue Shopping',
  },

  CHECKOUT: {
    INFORMATION_TITLE: 'Checkout: Your Information',
    OVERVIEW_TITLE: 'Checkout: Overview',
    COMPLETE_TITLE: 'Checkout: Complete!',
    COMPLETE_HEADER: 'Thank you for your order!',
    BACK_HOME_BUTTON: 'Back Home',
  },

  FOOTER: {
    COPYRIGHT: /© \d{4} Sauce Labs\. All Rights Reserved\./,
    SOCIAL_LINKS: {
      X: 'https://x.com/saucelabs',
      FACEBOOK: 'https://www.facebook.com/saucelabs',
      LINKEDIN: 'https://www.linkedin.com/company/sauce-labs/',
    },
  },

  ERRORS: {
    USERNAME_REQUIRED: 'Epic sadface: Username is required',
    LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
    INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
    LOGIN_REQUIRED: (route: string) => `Epic sadface: You can only access '${route}' when you are logged in.`,
    FIRST_NAME_REQUIRED: 'Error: First Name is required',
  },
} as const;
