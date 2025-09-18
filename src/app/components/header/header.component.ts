import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';


@Component({
  selector: 'app-header',
 imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(
    // private productService: ProductService,
    private router: Router,
    // private authService: any,
    // @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    // private authService: MsalService,
    // private msalBroadcastService: MsalBroadcastService,
    // private loginService: LoginService,
    
  ) {}
  
  isIframe = false;
  loginDisplay = false;
  isAdmin = false;
  private readonly _destroying$ = new Subject<void>();
  // claims: Claim[] = [];
  profilePictureUrl = '';

  loginPopup() {
    
    }

   logout() {
 
  }
}
