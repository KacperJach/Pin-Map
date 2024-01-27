import { Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {Pin} from "../shared/Pin";
import {PinService} from "../services/pin.service";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {BreakpointObserver} from "@angular/cdk/layout";
import {tap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {DeleteMarkerDialogComponent} from "../dialogs/delete-marker-dialog/delete-marker-dialog.component";
import {EditMarkerDialogComponent} from "../dialogs/edit-marker-dialog/edit-marker-dialog.component";

@Component({
  selector: 'app-pins-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatInputModule, FormsModule, MatTableModule, MatPaginatorModule],
  templateUrl: './pins-list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrl: './pins-list.component.less'
})
export class PinsListComponent implements OnInit {
  dataSource!: MatTableDataSource<Pin, MatPaginator>;
  columnsToDisplay = ['name', 'latitude', 'longitude', 'color'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Pin | undefined;

  pinList: Pin[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isLargeScreen: boolean = false;

  constructor(private pinService: PinService,
              private breakpointObserver: BreakpointObserver,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.refreshList();
  }

  initObserver() {
    this.breakpointObserver.observe([
      '(min-width: 700px)'
    ]).pipe(
      tap(result => this.isLargeScreen = result.matches)
    ).subscribe(result => {
      if (result.matches) {
        this.dataSource.paginator = this.paginator;
      } else {
        this.dataSource.paginator = null;
      }
    });
  }

  refreshList() {
    this.pinService.getUserPins().subscribe(response => {
      this.pinList = response.pins
      this.dataSource = new MatTableDataSource<Pin>(this.pinList);
      this.dataSource.paginator = this.paginator;
      this.initObserver();
    });
  }

  openDeleteDialog(selectedEntry: Pin): void {
    const dialogRef = this.dialog.open(DeleteMarkerDialogComponent, {
      width: '370px',
      height: '200px',
      data: selectedEntry
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.deleted) {
        this.refreshList();
      }
    });
  }

  openEditDialog(selectedEntry: Pin): void {
    const dialogRef = this.dialog.open(EditMarkerDialogComponent, {
      width: '500px',
      height: '700px',
      data: selectedEntry
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.edited) {
        this.refreshList();
      }
    });
  }

}
