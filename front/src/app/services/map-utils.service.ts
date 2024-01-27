import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injectable,
  Injector,
  Type
} from '@angular/core';
import * as L from "leaflet";
import {Pin} from "../shared/Pin";
import {MapPopupComponent} from "../map/map-popup/map-popup.component";

@Injectable({
  providedIn: 'root'
})
export class MapUtilsService {

  private elements: HTMLElement[] = [];
  private refs: ComponentRef<unknown>[] = [];

  constructor(private injector: Injector,
              private environmentInjector: EnvironmentInjector,
              private applicationRef: ApplicationRef) {}

  generatePinIcon(customColor: string): L.DivIcon {
    let markerHtmlStyles = `background-color: ${customColor};
    width: 2rem;
    height: 2rem;
    display: block;
    left: -1rem;
    top: -1rem;
    position: relative;
    border-radius: 2rem 2rem 0;
    transform: rotate(45deg);`

    return L.divIcon({
      className: "",
      iconAnchor: [0, 24],
      popupAnchor: [0, -36],
      html: `<span style="${markerHtmlStyles}" />`
    })
  }

  generateMarker(pin: Pin): [L.Marker, ComponentRef<MapPopupComponent>] {
    let icon = this.generatePinIcon(pin.color);
    let marker = new L.Marker([pin.latitude, pin.longitude], {icon: icon});
    let [popup, component] = this.createPopupElement(pin)
    marker.bindPopup(popup);
    return [marker, component];
  }

  public createPopupElement(pin: Pin): [HTMLElement, ComponentRef<MapPopupComponent>] {
    const [element, component] = this.createElementWithComponent(MapPopupComponent);
    component.instance.pin = pin;
    return [element, component];
  }

  private createElementWithComponent<C>(componentType: Type<C>, tag = 'div'): [HTMLElement, ComponentRef<C>] {
    const element = document.createElement(tag)
    const component = createComponent(componentType, {
      elementInjector: this.injector,
      environmentInjector: this.environmentInjector,
      hostElement: element
    });
    this.applicationRef.attachView(component.hostView);
    this.refs.push(component);
    this.elements.push(element);
    return [element, component];
  }

  public cleanup(): void {
    this.refs.splice(0).forEach((ref) => ref.destroy());
    this.elements.splice(0).forEach((element) => element.remove());
  }

}
