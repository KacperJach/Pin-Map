import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {PinService} from "../../services/pin.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxColorsModule, validColorValidator} from "ngx-colors";

@Component({
  selector: 'app-add-marker',
  standalone: true,
  imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogClose, MatInputModule, ReactiveFormsModule, MatIconModule, MatToolbarModule, NgxColorsModule, FormsModule],
  templateUrl: './add-marker-dialog.component.html',
  styleUrl: './add-marker-dialog.component.less'
})
export class AddMarkerDialogComponent implements OnInit {

  addPinFormGroup: FormGroup = new FormGroup('');

  constructor(public dialogRef: MatDialogRef<AddMarkerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { latitude: number, longitude: number },
              private pinService: PinService,
              private snackbarService: MatSnackBar) {
  }

  ngOnInit() {
    this.initForm()

    this.addPinFormGroup.controls["inputCtrl"].valueChanges.subscribe((color) => {
      if (this.addPinFormGroup.controls["pickerCtrl"].valid) {
        this.addPinFormGroup.controls["pickerCtrl"].setValue(color, {
          emitEvent: false,
        });
      }
    });
    this.addPinFormGroup.controls["pickerCtrl"].valueChanges.subscribe((color) =>
      this.addPinFormGroup.controls["inputCtrl"].setValue(color, {
        emitEvent: false,
      })
    );
  }

  private initForm(): void {
    this.addPinFormGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      latitude: new FormControl({value: this.data.latitude, disabled: true}, Validators.required),
      longitude: new FormControl({value: this.data.longitude, disabled: true}, Validators.required),
      description: new FormControl('', Validators.required),
      inputCtrl: new FormControl("#000000", [validColorValidator(), Validators.required]),
      pickerCtrl: new FormControl("#000000"),
    }, { updateOn: "change" });
  }

  closeDialog(added: boolean) {
    this.dialogRef.close({added: added});
  }

  submitForm() {
    const name = this.addPinFormGroup.get('name')?.value;
    const latitude = this.addPinFormGroup.get('latitude')?.value;
    const longitude = this.addPinFormGroup.get('longitude')?.value;
    const description = this.addPinFormGroup.get('description')?.value;
    const color = this.addPinFormGroup.get('inputCtrl')?.value;
    this.pinService.addPin(name, latitude, longitude, description, color).subscribe({
      next: (response) => {
        this.createSnackbar(response.msg);
        this.closeDialog(true)
      },
      error: (error) => {
        console.log(error)
        this.createSnackbar("Pin adding failed. Try again later.");
      }
    });
  }

  createSnackbar(message: string) {
    this.snackbarService.open(message, 'Close', {
      duration: 3000,
    });
  }

}
