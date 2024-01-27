import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {AuthStateService} from "../auth/auth-state.service";
import {AddPinResponse} from "../shared/AddPinResponse";
import {environment} from "../environment/environment";
import {GetPinResponse} from "../shared/GetPinResponse";
import {DeletePinResponse} from "../shared/DeletePinResponse";

@Injectable({
  providedIn: 'root'
})
export class PinService {

  apiUrl: string;

  constructor(private http: HttpClient, private authState: AuthStateService) {
    this.apiUrl = environment.apiUrl;
  }

  getUserPins() {
    let requestParams = new HttpParams().append('user_id', this.authState.getUserId());
    return this.http.get<GetPinResponse>(this.apiUrl + '/get_pins', {params: requestParams});
  }

  addPin(name: string, latitude: number, longitude: number, description: string, color: string) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('latitude', latitude.toString())
    formData.append('longitude', longitude.toString())
    formData.append('description', description)
    formData.append('color', color);
    formData.append('user_id', this.authState.getUserId().toString());
    return this.http.post<AddPinResponse>(this.apiUrl + '/add_pin', formData);
  }

  deletePin(id: number) {
    let requestParams = new HttpParams().set('pin_id', id);
    return this.http.delete<DeletePinResponse>(this.apiUrl + '/delete_pin', {params: requestParams});
  }

  editPin(id: number, name: string, latitude: number, longitude: number, description: string, color: string) {
    const formData = new FormData()
    formData.append('pin_id', id.toString());
    formData.append('name', name);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('description', description);
    formData.append('color', color);
    return this.http.put<DeletePinResponse>(this.apiUrl + '/edit_pin', formData);
  }

}
