import { test } from '@playwright/test';
import { InventoryPage } from '@pages/Inventory/inventoryPage';
import { ProductDetailsPage } from '@pages/ProductDetails/productDetailsPage';
import { PRODUCT_IDS, PRODUCT_NAMES } from '@constants/routes.constants';

test.describe('Detalhe do produto', () => {
  test('Deve exibir o detalhe ao clicar em um produto da lista', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const details = new ProductDetailsPage(page);

    await inventory.abrir();
    await inventory.validarTela();
    const dadosDaLista = await inventory.obterDadosProduto(PRODUCT_NAMES.BACKPACK);

    await inventory.abrirProduto(PRODUCT_NAMES.BACKPACK);

    await details.validarTela(PRODUCT_IDS.BACKPACK, PRODUCT_NAMES.BACKPACK);
    await details.verificarDadosIguaisALista(dadosDaLista);
  });

  test('Deve voltar para a Home ao clicar em Back to products', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const details = new ProductDetailsPage(page);

    await details.abrir(PRODUCT_IDS.BACKPACK);
    await details.validarTela(PRODUCT_IDS.BACKPACK, PRODUCT_NAMES.BACKPACK);

    await details.voltarParaProdutos();

    await inventory.validarTela();
  });

  test('Deve adicionar o produto ao carrinho pelo detalhe', async ({ page }) => {
    const details = new ProductDetailsPage(page);

    await details.abrir(PRODUCT_IDS.BACKPACK);
    await details.validarTela(PRODUCT_IDS.BACKPACK, PRODUCT_NAMES.BACKPACK);
    await details.header.verificarQuantidadeNoBadge(0);

    await details.adicionarAoCarrinho();

    await details.verificarBotaoRemover();
    await details.header.verificarQuantidadeNoBadge(1);
  });
});
