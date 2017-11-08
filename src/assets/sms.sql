CREATE TABLE IF NOT EXISTS sms__app (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  emulateur VARCHAR(20),
  title VARCHAR(250),
  message VARCHAR(250),
  sms__date VARCHAR(250)
  );

INSERT INTO sms__app (emulateur, title, message, sms__date) VALUES ('0666541890', 'Title 1', 'Message 1', '2010-05-28 15:36:56');
INSERT INTO sms__app (emulateur, title, message, sms__date) VALUES ('0666541890', 'Title 2', 'Message 2', '2010-05-28 15:36:56');
INSERT INTO sms__app (emulateur, title, message, sms__date) VALUES ('0666541890', 'Title 3', 'Message 3', '2010-05-28 15:36:56');
