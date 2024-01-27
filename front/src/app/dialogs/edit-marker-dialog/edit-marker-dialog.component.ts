import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {PinService} from "../../services/pin.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Pin} from "../../shared/Pin";
import {NgxColorsModule, validColorValidator} from "ngx-colors";

@Component({
  selector: 'app-edit-marker-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatToolbarModule, ReactiveFormsModule, MatDialogActions, MatDialogContent, MatDialogTitle, NgxColorsModule],
  templateUrl: './edit-marker-dialog.component.html',
  styleUrl: './edit-marker-dialog.component.less'
})
export class EditMarkerDialogComponent implements OnInit {
  editPinFormGroup: FormGroup = new FormGroup('');

  constructor(public dialogRef: MatDialogRef<EditMarkerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public pin: Pin,
              private pinService: PinService,
              private snackbarService: MatSnackBar) {
  }

  ngOnInit() {
    this.initForm()

    this.editPinFormGroup.controls["inputCtrl"].valueChanges.subscribe((color) => {
      if (this.editPinFormGroup.controls["pickerCtrl"].valid) {
        this.editPinFormGroup.controls["pickerCtrl"].setValue(color, {
          emitEvent: false,
        });
      }
    });
    this.editPinFormGroup.controls["pickerCtrl"].valueChanges.subscribe((color) =>
      this.editPinFormGroup.controls["inputCtrl"].setValue(color, {
        emitEvent: false,
      })
    );
  }

  private initForm(): void {
    this.editPinFormGroup = new FormGroup({
      name: new FormControl(this.pin.name, Validators.required),
      latitude: new FormControl({value: this.pin.latitude, disabled: true}, Validators.required),
      longitude: new FormControl({value: this.pin.longitude, disabled: true}, Validators.required),
      description: new FormControl(this.pin.description, Validators.required),
      inputCtrl: new FormControl(this.pin.color, [validColorValidator(), Validators.required]),
      pickerCtrl: new FormControl(this.pin.color),
    });
  }

  closeDialog(edited: boolean) {
    this.dialogRef.close({edited: edited});
  }

  submit() {
    const name = this.editPinFormGroup.get('name')?.value;
    const latitude = this.editPinFormGroup.get('latitude')?.value;
    const longitude = this.editPinFormGroup.get('longitude')?.value;
    const description = this.editPinFormGroup.get('description')?.value;
    const color = this.editPinFormGroup.get('inputCtrl')?.value;

    this.pinService.editPin(this.pin.id, name, latitude, longitude, description, color).subscribe({
      next: (response) => {
        this.createSnackbar(response.msg);
        this.closeDialog(true)
      },
      error: (error) => {
        console.log(error)
        this.createSnackbar("Pin editing failed. Try again later.");
      }
    });
  }

  createSnackbar(message: string) {
    this.snackbarService.open(message, 'Close', {
      duration: 3000,
    });
  }
}
