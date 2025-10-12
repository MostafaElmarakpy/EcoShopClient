import { Component } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../../components/header/header.component";

@Component({
  selector: 'app-admin-layout',
  imports: [FooterComponent, CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
