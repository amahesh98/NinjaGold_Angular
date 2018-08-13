import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { 

  }
  getGold(){
    return this._http.get('/gold')
  }
  performTask(activity:String){
    return this._http.post('/gold', {activity:activity})
  }
  save(gold:Number){
    return this._http.post('/save', {gold:gold})
  }
  getLeaderboard(){
    return this._http.get('/leaderboard')
  }

}
