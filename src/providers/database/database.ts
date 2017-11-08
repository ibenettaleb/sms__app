import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import 'rxjs/add/operator/map';
import {BehaviorSubject} from "rxjs/Rx";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {Platform} from "ionic-angular";
import {Storage} from "@ionic/storage";

@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter,
              private storage: Storage,
              private sqlite: SQLite,
              private platform: Platform,
              public http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'developers.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });

  }

  fillDatabase() {
    this.http.get('assets/sms.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }

  addSms(emulateur, title, message, sms__date) {
    let data = [emulateur, title, message, sms__date];
    return this.database.executeSql("INSERT INTO sms__app (emulateur, title, message, sms__date) VALUES (?, ?, ?, ?);", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getAllSms() {
    return this.database.executeSql("SELECT * FROM sms__app", []).then((data) => {
      let sms = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          sms.push({emulateur: data.rows.item(i).emulateur, title: data.rows.item(i).title, message: data.rows.item(i).message, sms__date: data.rows.item(i).sms__date});
        }
      }
      return sms;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}
