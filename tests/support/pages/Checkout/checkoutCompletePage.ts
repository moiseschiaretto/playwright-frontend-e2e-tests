import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HeaderComponent } from '@components/headerComponent';
import { ROUTES } from '@constants/routes.constants';
import { TEXTS } from '@constants/texts.constants';

// Checkout, etapa 3: compra concluída (/checkout-complete.html)
export class CheckoutCompletePage {
  private readonly page: Page;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
  }

  get mensagemSucesso() {
    return this.page.locator('[data-test="complete-header"]');
  }

  get botaoVoltarInicio() {
    return this.page.locator('[data-test="back-to-products"]');
  }

  // Confirma que a tela aberta é a compra concluída: URL, título e componentes
  async validarTela(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTES.CHECKOUT_COMPLETE);
    await expect(this.page).toHaveTitle(TEXTS.BROWSER_TITLE);
    await expect(this.header.tituloTela).toHaveText(TEXTS.CHECKOUT.COMPLETE_TITLE);
    await this.header.validar();
    await expect(this.mensagemSucesso).toHaveText(TEXTS.CHECKOUT.COMPLETE_HEADER);
    await expect(this.botaoVoltarInicio).toHaveText(TEXTS.CHECKOUT.BACK_HOME_BUTTON);
  }
}
