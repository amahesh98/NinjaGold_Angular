import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activityLog=[]
  title = 'Ninja Gold';
  gold=0
  message=''
  showMessage=false
  constructor(private _httpService:HttpService){

  }
  ngOnInit(){
    this.getGold()
    this.getFeed()
    this.getLeaderboard()
  }
  getFeed(){
    console.log("Getting feed")
  }
  getGold(){
    let goldObservable = this._httpService.getGold()
    goldObservable.subscribe(data=>{
      this.gold=data['gold']
    })
  }
  getLeaderboard(){
    let observable=this._httpService.getLeaderboard()
    observable.subscribe(data=>{
      console.log(data)
    })
  }
  performTask(activity:String){
    this.message=''
    this.showMessage=false
    let goldObservable=this._httpService.performTask(activity)
    goldObservable.subscribe(data=>{
      console.log("Recieved data: ", data)
      if(data.response==1){
        this.gold+=data.gold
        if(data.gold>=0){
          this.activityLog.push(`You earned ${data.gold} gold by ${activity} on ${new Date()}`)
        }
        else{
          this.activityLog.push(`You lost ${0-data.gold} gold by ${activity} on ${new Date()}`)
        }
      }
    })
  }
  save(event: any){
    let saveObservable=this._httpService.save(this.gold)
    saveObservable.subscribe(data=>{
      console.log("Recieved data: ", data)
      this.message='Successfully saved'
      this.showMessage=true
    })
    console.log('Event: ', event)
  }
}
