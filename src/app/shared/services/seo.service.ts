import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
}

const SITE_NAME = 'EcoShop';
const DEFAULT_DESCRIPTION = 'EcoShop - Your one-stop destination for eco-friendly products. Shop sustainable, affordable, and high-quality items.';
const DEFAULT_IMAGE = 'assets/images/ecoshop-og.png';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  updateSeo(data: SeoData): void {
    const pageTitle = data.title ? `${data.title} | ${SITE_NAME}` : SITE_NAME;
    this.title.setTitle(pageTitle);

    this.setMeta('description', data.description || DEFAULT_DESCRIPTION);
    if (data.keywords) {
      this.setMeta('keywords', data.keywords);
    }

    // OpenGraph tags
    this.setMeta('og:title', data.ogTitle || pageTitle, true);
    this.setMeta('og:description', data.ogDescription || data.description || DEFAULT_DESCRIPTION, true);
    this.setMeta('og:image', data.ogImage || DEFAULT_IMAGE, true);
    this.setMeta('og:type', data.ogType || 'website', true);
    if (data.ogUrl) {
      this.setMeta('og:url', data.ogUrl, true);
    }
    this.setMeta('og:site_name', SITE_NAME, true);

    // Twitter card
    this.setMeta('twitter:card', 'summary_large_image');
    this.setMeta('twitter:title', data.ogTitle || pageTitle);
    this.setMeta('twitter:description', data.ogDescription || data.description || DEFAULT_DESCRIPTION);
    this.setMeta('twitter:image', data.ogImage || DEFAULT_IMAGE);
  }

  private setMeta(name: string, content: string, isProperty = false): void {
    const attr = isProperty ? 'property' : 'name';
    const existing = this.meta.getTag(`${attr}="${name}"`);
    if (existing) {
      this.meta.updateTag({ [attr]: name, content });
    } else {
      this.meta.addTag({ [attr]: name, content });
    }
  }
}
