import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SMS } from '@ionic-native/sms';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private sms__app : FormGroup;
  phoneNumber: number;
  textMessage: string;
  title: string;

  constructor(private toast: ToastController,
              public navCtrl: NavController,
              private sms: SMS,
              private formBuilder: FormBuilder) {
    this.textMessage = "";
    this.sms__app = this.formBuilder.group({
      phoneNumber: ['', Validators.required],
      title: ['', Validators.required],
      textMessage: ['', Validators.required]
    });
    console.log(new Date().toLocaleString());
  }
  async sendTextMessage() {
    try {
      await this.sms.send(String(this.phoneNumber), this.title + '\\n' +this.textMessage);
      const toast = this.toast.create({
        message: 'Text was sent!',
        duration: 3000
      });
      toast.present();
    }
    catch (e) {
      const toast = this.toast.create({
        message: 'Text was not sent!',
        duration: 3000
      });
      toast.present();
    }
  }
}
