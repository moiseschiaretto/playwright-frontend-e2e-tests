import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { getCredentials, type UserType } from '@helpers/credentials';
import { ROUTES } from '@constants/routes.constants';
import { TEXTS } from '@constants/texts.constants';

// Home de Login (/)
export class LoginPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get logo() {
    return this.page.locator('.login_logo');
  }

  get campoUsuario() {
    return this.page.locator('[data-test="username"]');
  }

  get campoSenha() {
    return this.page.locator('[data-test="password"]');
  }

  get botaoLogin() {
    return this.page.locator('[data-test="login-button"]');
  }

  get quadroUsuarios() {
    return this.page.locator('[data-test="login-credentials"]');
  }

  get quadroSenha() {
    return this.page.locator('[data-test="login-password"]');
  }

  get mensagemErro() {
    return this.page.locator('[data-test="error"]');
  }

  get botaoFecharErro() {
    return this.page.locator('[data-test="error-button"]');
  }

  async abrir(): Promise<void> {
    await this.page.goto(ROUTES.LOGIN);
  }

  // Confirma que a tela aberta é a Home de Login: URL, título e componentes
  async validarTela(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTES.LOGIN);
    await expect(this.page).toHaveTitle(TEXTS.BROWSER_TITLE);
    await expect(this.logo).toHaveText(TEXTS.LOGO);
    await expect(this.campoUsuario).toBeVisible();
    await expect(this.campoUsuario).toHaveAttribute('placeholder', TEXTS.LOGIN.USERNAME_PLACEHOLDER);
    await expect(this.campoSenha).toBeVisible();
    await expect(this.campoSenha).toHaveAttribute('placeholder', TEXTS.LOGIN.PASSWORD_PLACEHOLDER);
    await expect(this.campoSenha).toHaveAttribute('type', 'password');
    await expect(this.botaoLogin).toHaveValue(TEXTS.LOGIN.BUTTON);
    await expect(this.quadroUsuarios).toContainText(TEXTS.LOGIN.ACCEPTED_USERNAMES);
    await expect(this.quadroSenha).toContainText(TEXTS.LOGIN.PASSWORD_FOR_ALL_USERS);
  }

  async verificarCamposVazios(): Promise<void> {
    await expect(this.campoUsuario).toHaveValue('');
    await expect(this.campoSenha).toHaveValue('');
  }

  async logarComo(userType: UserType): Promise<void> {
    const { username, password } = getCredentials(userType);
    await this.preencherCredenciais(username, password);
  }

  async preencherCredenciais(username: string, password: string): Promise<void> {
    await this.campoUsuario.fill(username);
    await this.campoSenha.fill(password);
    await this.botaoLogin.click();
  }

  async enviarSemCredenciais(): Promise<void> {
    await this.botaoLogin.click();
  }

  async verificarMensagemErro(textoEsperado: string): Promise<void> {
    await expect(this.mensagemErro).toBeVisible();
    await expect(this.mensagemErro).toHaveText(textoEsperado);
  }

  async verificarSemMensagemErro(): Promise<void> {
    await expect(this.mensagemErro).toHaveCount(0);
  }

  async fecharMensagemErro(): Promise<void> {
    await this.botaoFecharErro.click();
  }
}
