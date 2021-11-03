
// The name of the Gmail Label that is to be purged?
var GMAIL_LABEL = "Discounts";    


// Purge messages automatically after how many days?
var PURGE_AFTER = "30";

function Intialize() {
  return;
}

function Install() {
  Uninstall();

  ScriptApp.newTrigger("purgeGmail")
           .timeBased()
           .at(new Date())
           .create();
  
  ScriptApp.newTrigger("purgeGmail")
           .timeBased().everyDays(1).create();

}

function Uninstall() {
  
  var triggers = ScriptApp.getScriptTriggers();
  for (var i=0; i<triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
}

function purgeGmail() {
  
  var age = new Date();  
  age.setDate(age.getDate() - PURGE_AFTER);    
  
  var purge  = Utilities.formatDate(age, Session.getScriptTimeZone(), "yyyy-MM-dd");
  var search = "label:" + GMAIL_LABEL + " before:" + purge;
  
  try {
    
    var threads = GmailApp.search(search, 0, 100);
    
    var deleted = 0;
    for (var i=0; i<threads.length; i++) {
      var messages = GmailApp.getMessagesForThread(threads[i]);
      for (var j=0; j<messages.length; j++) {
        var email = messages[j];       
        if (email.getDate() < age) {
          email.moveToTrash();
          deleted ++;
        }
      }
    }
    console.log("done removing " + deleted + " emails")
    
    if (threads.length == 100) {
      Install();
    }
    
  } catch (e) {
    console.log(e)
  }
}