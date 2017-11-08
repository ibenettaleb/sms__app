import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import {DatabaseProvider} from "../../providers/database/database";
declare let SMS:any;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  ListSms: any[];
  sms : any[];

  constructor(public navCtrl: NavController,
              public platform:Platform,
              public androidPermissions: AndroidPermissions,
              public alertCtrl: AlertController,
              private databaseprovider: DatabaseProvider) {
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.addSms();
      }
    })
  }

  loadSmsData() {
    this.databaseprovider.getAllSms().then(data => {
      this.sms = data;
      console.log(data);
    })
  }

  addSms() {

    this.platform.ready().then((readySource) => {

      let filter = {
        box : 'inbox', // 'inbox' (default), 'sent', 'draft'
        indexFrom : 0, // start from index 0
        maxCount : 50, // count of SMS to return each time
      };

      if(SMS) SMS.listSMS(filter, (ListSms)=>{
          this.ListSms = ListSms;
        },

        Error=>{
          console.log('error list sms: ' + Error);
        });

    });
    //for (let item of this.ListSms) {
      this.databaseprovider.addSms("066654189123",
        "Title 3",
        "Message 4",
        "2017 - 06 - 12")
        .then(data =>{
          this.loadSmsData();
        });
    //}
  }


  ionViewWillEnter()
  {

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
      success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
    );

    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);

  }

  async ionViewDidLoad()
  {
    this.platform.ready().then((readySource) => {

      let filter = {
        box : 'inbox', // 'inbox' (default), 'sent', 'draft'
        indexFrom : 0, // start from index 0
        maxCount : 50, // count of SMS to return each time
      };

      if(SMS) SMS.listSMS(filter, (ListSms)=>{
          this.ListSms = ListSms;
        },

        Error=>{
          console.log('error list sms: ' + Error);
        });

    });
  }

  showAlert(title_t, message_t) {
    let alert = this.alertCtrl.create({
      title: title_t,
      subTitle: message_t,
      buttons: ['OK']
    });
    alert.present();
  }

  async ionViewDidEnter()
  {

    this.platform.ready().then((readySource) => {

      if(SMS) SMS.startWatch(()=>{
        console.log('watching started');
      }, Error=>{
        console.log('failed to start watching');
      });

      document.addEventListener('onSMSArrive', (e:any)=>{
        this.ListSms.unshift(e.data);
      });

    });
  }
}
