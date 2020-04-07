import { html, customElement, property, TemplateResult, query, PropertyValues } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import { IconButton } from '@material/mwc-icon-button';
import '@material/mwc-drawer';
import { Drawer } from '@material/mwc-drawer';
import '@material/mwc-snackbar';

import './director';
import './stuff/snack-bar';
import './stuff/salavat-counter';
import { BaseElement } from './stuff/base-element';
import { chatRoom } from './stuff/chat-room';
import { styleConfig } from './config';
import { styleAppLayout } from './stuff/style-app-layout';
import { menuIcon, guideIcon, heartIcon, getAppIcon, plusIcon, campaignIcon, aboutUsIcon, supportIcon, imageIcon } from './stuff/icon';

@customElement('salavat-pwa')
export class SalavatPWA extends BaseElement {
  @property({ type: String })
  protected _page: string = '';

  @property({ type: Boolean })
  protected _showSubmit: boolean = false;

  @query('mwc-drawer')
  protected _drawer!: Drawer;

  static styles = [styleConfig, styleAppLayout];

  constructor() {
    super();

    chatRoom.onPropertyChanged('page', (pageName: string | unknown) => {
      if (!(typeof pageName === 'string')) return;
      this._page = pageName;
    });
  }

  protected render(): TemplateResult {
    this._log('render');
    return html`
      <mwc-drawer type="modal" @MDCDrawer:closed="${() => chatRoom.setProperty('sideMenuOpened', false) }">
        <div class="drawer-content">
          <div class="salavat-badge">
            <div class="title">صلوات های من:</div>
            <div class="number">${(114).toLocaleString('fa')}</div>
          </div>
          <div class="menu">
            <mwc-button fullwidth>
              <div class="button-content">کمپین ${campaignIcon}</div>
            </mwc-button>
            <mwc-button fullwidth>
              <div class="button-content">داستان ما ${aboutUsIcon}</div>
            </mwc-button>
            <mwc-button fullwidth>
              <div class="button-content">حمایت ${supportIcon}</div>
            </mwc-button>
            <!--<mwc-button fullwidth>
              <div class="button-content">دانلود والپیپر ${imageIcon}</div>
            </mwc-button>-->
            <mwc-button fullwidth>
              <div class="button-content">نصب برنامه ${getAppIcon}</div>
            </mwc-button>
            <mwc-button fullwidth>
              <div class="button-content">راهنما ${guideIcon}</div>
            </mwc-button>
          </div>
          <div class="gap"></div>
          <a class="drawer-footer" href="https://github.com/AliMD/Salav.at" target="_blank">Salav.at Beta v0.5</a>
        </div>
        <div slot="appContent">
          <mwc-icon-button
            class="menu-button"
            @click="${() => chatRoom.setProperty('sideMenuOpened', true) }"
          >
            ${menuIcon}
          </mwc-icon-button>
          <div class="main-image">
            <div class="submit-button" ?show="${this._showSubmit}">
              <mwc-icon-button>${plusIcon}</mwc-icon-button>
            </div>
          </div>
          <main role="main">
            <salavat-counter
              .debug="${false}"
              label-before="تا این لحظه"
              label-after="صلوات نذر شده"
            >
            </salavat-counter>
          </main>
          <div
            class="footer-text"
            @click="${() => chatRoom.setProperty('snackbar', { open: true, text: 'ساخته شده با عشق' })}"
          >
            <span>Made with</span>${heartIcon}
          </div>
          <mwc-icon-button class="get-app-button" @click="${() => this._showSubmit = !this._showSubmit}">${getAppIcon}</mwc-icon-button>
        </div>
      </mwc-drawer>
      <snack-bar></snack-bar>
    `;
  }

  protected updated() {
    this._log('updated');
    const iconButtonList: NodeListOf<IconButton> = this.renderRoot.querySelectorAll('mwc-icon-button');
    for (let i = iconButtonList.length-1; i >= 0; i--) {
      const internalIcon = iconButtonList.item(i).renderRoot.querySelector<HTMLElement>('.material-icons');
      if (internalIcon) {
        internalIcon.style.display = 'none';
        this._log('Remove mwc-icon-button internal material-icon element!');
      }
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this._log('firstUpdated');
    this._showSubmit = true;

    chatRoom.onPropertyChanged('sideMenuOpened', (sideMenuOpened: boolean | unknown) => {
      if (!(this._drawer && this._drawer.open != sideMenuOpened)) return;
      this._drawer.open = Boolean(sideMenuOpened);
    });
  }
}
