import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { TEXTS } from '@constants/texts.constants';

// Rodapé comum às telas logadas: redes sociais e copyright
export class FooterComponent {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get rodape() {
    return this.page.locator('[data-test="footer"]');
  }

  get linkX() {
    return this.page.locator('[data-test="social-x"]');
  }

  get linkFacebook() {
    return this.page.locator('[data-test="social-facebook"]');
  }

  get linkLinkedin() {
    return this.page.locator('[data-test="social-linkedin"]');
  }

  get copyright() {
    return this.page.locator('[data-test="footer-copy"]');
  }

  async validar(): Promise<void> {
    await expect(this.rodape).toBeVisible();
    await expect(this.linkX).toHaveAttribute('href', TEXTS.FOOTER.SOCIAL_LINKS.X);
    await expect(this.linkFacebook).toHaveAttribute('href', TEXTS.FOOTER.SOCIAL_LINKS.FACEBOOK);
    await expect(this.linkLinkedin).toHaveAttribute('href', TEXTS.FOOTER.SOCIAL_LINKS.LINKEDIN);
    await expect(this.copyright).toContainText(TEXTS.FOOTER.COPYRIGHT);
  }
}
