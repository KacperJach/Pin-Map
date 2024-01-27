import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {Pin} from "../../shared/Pin";
import {PinService} from "../../services/pin.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-delete-marker-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './delete-marker-dialog.component.html',
  styleUrl: './delete-marker-dialog.component.less'
})
export class DeleteMarkerDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteMarkerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public pin: Pin,
              private pinService: PinService,
              private snackbarService: MatSnackBar) {}


  submit(): void {
    this.pinService.deletePin(this.pin.id).subscribe(() => {
      this.closeDialog(true);
      this.createSnackbar("Pin deleted successfully")
    });
  }

  closeDialog(deleted: boolean) {
    this.dialogRef.close({'deleted': deleted});
  }

  createSnackbar(message: string) {
    this.snackbarService.open(message, 'Close', {
      duration: 3000,
    });
  }
}
