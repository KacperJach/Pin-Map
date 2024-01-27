import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import {PinService} from "../services/pin.service";
import {Pin} from "../shared/Pin";
import {MatDialog} from "@angular/material/dialog";
import {AddMarkerDialogComponent} from "../dialogs/add-marker-dialog/add-marker-dialog.component";
import {MapUtilsService} from "../services/map-utils.service";

let DEFAULT_LATITUDE = 49;
let DEFAULT_LONGITUDE = 15;
let DEFAULT_ZOOM = 5
let DEFAULT_ZOOM_ON_LOCATION = 10

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.less'
})

export class MapComponent implements OnInit, OnDestroy {

  pinList: Pin[] = []
  private map!: L.Map;
  layerGroup = L.layerGroup();

  private tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  constructor(private pinService: PinService,
              public dialog: MatDialog,
              private mapUtilsService: MapUtilsService) {}


  ngOnDestroy() {
    this.mapUtilsService.cleanup();
  }

  ngOnInit() {
    this.getLocation();
    this.initMap();
    this.refreshPins();
  }

  initMap() {
    this.map = L.map('map', {
      center: [DEFAULT_LATITUDE, DEFAULT_LONGITUDE],
      zoom: DEFAULT_ZOOM
    });
    this.tiles.addTo(this.map);
    this.setClickEventListener();
  }

  private setClickEventListener() {
    this.map.on("click", e => {
      this.openAddDialog(e.latlng.lat, e.latlng.lng);
    });
  }

  refreshPins() {
    this.pinService.getUserPins().subscribe(response => {
      this.cleanUpMarkers()
      this.pinList = response.pins;
      this.createMarkers();
    });
  }

  cleanUpMarkers() {
    this.mapUtilsService.cleanup();
    if (this.map.hasLayer(this.layerGroup)) {
      this.layerGroup.clearLayers();
      this.map.removeLayer(this.layerGroup);
    }
  }

  createMarkers(): void {
    this.pinList.forEach(pin => {
      const [marker, component] = this.mapUtilsService.generateMarker(pin);
      component.instance.onAction.subscribe(value => {
        if (value)
          this.refreshPins();
      })
      this.layerGroup.addLayer(marker);
      this.map.addLayer(this.layerGroup);
      marker.addTo(this.map);
    })
  }

  setMapLocation(position: GeolocationPosition) {
    if (!position || !this.map) {
      return;
    }

    this.map.flyTo(
      [position.coords.latitude, position.coords.longitude],
      DEFAULT_ZOOM_ON_LOCATION
    )
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
          this.setMapLocation(position);
        },
        (error: GeolocationPositionError) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  openAddDialog(latitude: number, longitude: number) {
    const dialogRef = this.dialog.open(AddMarkerDialogComponent, {
      width: '500px',
      height: '700px',
      data: {latitude: latitude, longitude: longitude}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.added) {
        this.refreshPins();
      }
    });
  }
}
