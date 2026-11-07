import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HeaderComponent } from '@components/headerComponent';
import { ROUTES } from '@constants/routes.constants';
import { TEXTS } from '@constants/texts.constants';

export interface DadosCheckout {
  nome: string;
  sobrenome: string;
  cep: string;
}

// Checkout, etapa 1: dados de entrega (/checkout-step-one.html)
export class CheckoutInformationPage {
  private readonly page: Page;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
  }

  get campoNome() {
    return this.page.locator('[data-test="firstName"]');
  }

  get campoSobrenome() {
    return this.page.locator('[data-test="lastName"]');
  }

  get campoCep() {
    return this.page.locator('[data-test="postalCode"]');
  }

  get botaoContinuar() {
    return this.page.locator('[data-test="continue"]');
  }

  get botaoCancelar() {
    return this.page.locator('[data-test="cancel"]');
  }

  get mensagemErro() {
    return this.page.locator('[data-test="error"]');
  }

  async abrir(): Promise<void> {
    await this.page.goto(ROUTES.CHECKOUT_STEP_ONE);
  }

  // Confirma que a tela aberta é a etapa de dados do Checkout: URL, título e componentes
  async validarTela(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTES.CHECKOUT_STEP_ONE);
    await expect(this.page).toHaveTitle(TEXTS.BROWSER_TITLE);
    await expect(this.header.tituloTela).toHaveText(TEXTS.CHECKOUT.INFORMATION_TITLE);
    await this.header.validar();
    await expect(this.campoNome).toBeVisible();
    await expect(this.campoSobrenome).toBeVisible();
    await expect(this.campoCep).toBeVisible();
    await expect(this.botaoContinuar).toBeVisible();
    await expect(this.botaoCancelar).toBeVisible();
  }

  async preencherDadosEntrega(dados: DadosCheckout): Promise<void> {
    await this.campoNome.fill(dados.nome);
    await this.campoSobrenome.fill(dados.sobrenome);
    await this.campoCep.fill(dados.cep);
    await this.botaoContinuar.click();
  }

  async verificarErroValidacao(textoEsperado: string): Promise<void> {
    await expect(this.mensagemErro).toBeVisible();
    await expect(this.mensagemErro).toHaveText(textoEsperado);
  }
}
