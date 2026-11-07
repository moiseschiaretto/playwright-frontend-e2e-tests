import { test } from '@playwright/test';
import { LoginPage } from '@pages/Login/loginPage';
import { InventoryPage } from '@pages/Inventory/inventoryPage';
import { ProductDetailsPage } from '@pages/ProductDetails/productDetailsPage';
import { CartPage } from '@pages/Cart/cartPage';
import { CheckoutInformationPage } from '@pages/Checkout/checkoutInformationPage';
import { CheckoutOverviewPage } from '@pages/Checkout/checkoutOverviewPage';
import { CheckoutCompletePage } from '@pages/Checkout/checkoutCompletePage';
import { PRODUCT_IDS, PRODUCT_NAMES } from '@constants/routes.constants';
import { loadTestData } from '@support/schemas';

// Jornada completa do usuário pela interface, do login até a compra concluída
test.describe('Fluxo de compra', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Deve realizar a compra completa, do login à confirmação', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const details = new ProductDetailsPage(page);
    const cart = new CartPage(page);
    const information = new CheckoutInformationPage(page);
    const overview = new CheckoutOverviewPage(page);
    const complete = new CheckoutCompletePage(page);
    const { checkout: dadosCheckout } = loadTestData();

    await login.abrir();
    await login.validarTela();
    await login.logarComo('standard');

    await inventory.validarTela();
    const dadosDaLista = await inventory.obterDadosProduto(PRODUCT_NAMES.BACKPACK);
    await inventory.abrirProduto(PRODUCT_NAMES.BACKPACK);

    await details.validarTela(PRODUCT_IDS.BACKPACK, PRODUCT_NAMES.BACKPACK);
    await details.verificarDadosIguaisALista(dadosDaLista);
    await details.adicionarAoCarrinho();
    await details.header.verificarQuantidadeNoBadge(1);
    await details.header.irParaCarrinho();

    await cart.validarTela();
    await cart.verificarProdutoPresente(PRODUCT_NAMES.BACKPACK);
    await cart.iniciarCheckout();

    await information.validarTela();
    await information.preencherDadosEntrega(dadosCheckout);

    await overview.validarTela();
    await overview.verificarQuantidadeItens(1);
    await overview.finalizarCompra();

    await complete.validarTela();
  });
});
