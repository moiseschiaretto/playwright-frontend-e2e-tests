import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HeaderComponent } from '@components/headerComponent';
import { FooterComponent } from '@components/footerComponent';
import type { DadosProduto } from '@pages/Inventory/inventoryPage';
import { ROUTES } from '@constants/routes.constants';
import { TEXTS } from '@constants/texts.constants';

// Home ao clicar em um produto (/inventory-item.html?id={id})
export class ProductDetailsPage {
  private readonly page: Page;
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
  }

  get botaoVoltar() {
    return this.page.locator('[data-test="back-to-products"]');
  }

  get nome() {
    return this.page.locator('[data-test="inventory-item-name"]');
  }

  get descricao() {
    return this.page.locator('[data-test="inventory-item-desc"]');
  }

  get preco() {
    return this.page.locator('[data-test="inventory-item-price"]');
  }

  get imagem() {
    return this.page.locator('[data-test="inventory-item"] img[data-test$="-img"]');
  }

  get botaoAdicionar() {
    return this.page.locator('[data-test="add-to-cart"]');
  }

  get botaoRemover() {
    return this.page.locator('[data-test="remove"]');
  }

  async abrir(idProduto: number): Promise<void> {
    await this.page.goto(`${ROUTES.INVENTORY_ITEM}?id=${idProduto}`);
  }

  // Confirma que a tela aberta é o detalhe do produto esperado: URL, título e componentes.
  // Esta tela não tem título fixo: o nome do produto é o título.
  async validarTela(idProduto: number, nomeProduto: string): Promise<void> {
    await expect(this.page).toHaveURL(`${ROUTES.INVENTORY_ITEM}?id=${idProduto}`);
    await expect(this.page).toHaveTitle(TEXTS.BROWSER_TITLE);
    await this.header.validar();
    await expect(this.botaoVoltar).toHaveText(TEXTS.PRODUCT_DETAILS.BACK_BUTTON);
    await expect(this.nome).toHaveText(nomeProduto);
    await expect(this.descricao).not.toBeEmpty();
    await expect(this.preco).toHaveText(/^\$\d+\.\d{2}$/);
    await expect(this.imagem).toHaveAttribute('alt', nomeProduto);
    await expect(this.botaoAdicionar).toHaveText(TEXTS.BUTTONS.ADD_TO_CART);
    await this.footer.validar();
  }

  // Nome, descrição e preço iguais aos exibidos na lista de produtos
  async verificarDadosIguaisALista(dadosDaLista: DadosProduto): Promise<void> {
    await expect(this.nome).toHaveText(dadosDaLista.nome);
    await expect(this.descricao).toHaveText(dadosDaLista.descricao);
    await expect(this.preco).toHaveText(dadosDaLista.preco);
  }

  async voltarParaProdutos(): Promise<void> {
    await this.botaoVoltar.click();
  }

  async adicionarAoCarrinho(): Promise<void> {
    await this.botaoAdicionar.click();
  }

  async verificarBotaoRemover(): Promise<void> {
    await expect(this.botaoRemover).toHaveText(TEXTS.BUTTONS.REMOVE);
  }
}
