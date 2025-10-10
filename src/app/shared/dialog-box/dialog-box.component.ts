import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent {
  message: string = "Are you sure you want to delete this item?";
  title: string = "Confirm Deletion";
  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.activeModal.close({ event: 'confirmed' });
  }

  cancel() {
    this.activeModal.dismiss('cancel');
  }
}