import {Component, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Pin} from "../../shared/Pin";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DeleteMarkerDialogComponent} from "../../dialogs/delete-marker-dialog/delete-marker-dialog.component";
import {EditMarkerDialogComponent} from "../../dialogs/edit-marker-dialog/edit-marker-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-map-popup',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './map-popup.component.html',
  styleUrl: './map-popup.component.less'
})
export class MapPopupComponent {
  public pin!: Pin;
  @Output() onAction = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog) {}

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteMarkerDialogComponent, {
      width: '370px',
      height: '200px',
      data: this.pin
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.deleted) {
        this.onAction.emit(true)
      }
    });
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditMarkerDialogComponent, {
      width: '500px',
      height: '700px',
      data: this.pin
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.edited) {
        this.onAction.emit(true);
      }
    });
  }

}
