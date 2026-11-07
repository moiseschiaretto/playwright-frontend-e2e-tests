import { test } from '@playwright/test';
import { InventoryPage } from '@pages/Inventory/inventoryPage';
import { CartPage } from '@pages/Cart/cartPage';
import { prepararCarrinho } from '@helpers/cart.helper';
import { PRODUCT_IDS, PRODUCT_SLUGS, PRODUCT_NAMES } from '@constants/routes.constants';

test.describe('Carrinho de compras', () => {
  test('Deve exibir produto adicionado no carrinho', async ({ page }) => {
    const cart = new CartPage(page);
    await prepararCarrinho(page, [PRODUCT_IDS.BACKPACK]);

    await cart.abrir();
    await cart.validarTela();

    await cart.verificarQuantidadeItens(1);
    await cart.verificarProdutoPresente(PRODUCT_NAMES.BACKPACK);
    await cart.header.verificarQuantidadeNoBadge(1);
  });

  test('Deve remover produto do carrinho', async ({ page }) => {
    const cart = new CartPage(page);
    await prepararCarrinho(page, [PRODUCT_IDS.BACKPACK]);

    await cart.abrir();
    await cart.validarTela();
    await cart.removerProduto(PRODUCT_SLUGS.BACKPACK);

    await cart.verificarQuantidadeItens(0);
    await cart.header.verificarQuantidadeNoBadge(0);
  });

  test('Deve adicionar múltiplos produtos e refletir no badge', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await inventory.abrir();
    await inventory.validarTela();
    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BACKPACK);
    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BIKE_LIGHT);
    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BOLT_T_SHIRT);
    await inventory.header.verificarQuantidadeNoBadge(3);

    await inventory.header.irParaCarrinho();

    await cart.validarTela();
    await cart.verificarQuantidadeItens(3);
  });
});
