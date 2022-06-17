//Register service worker asap
serviceWorkerInit()
let autosave = true
var db = new PouchDB('wryter');

function serviceWorkerInit() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }
}

// Setup Scripts
function setKeyHandlers() {
  $("#menuicon").click(function () {
    console.log('clicked')
    $('.burger').toggleClass('rotate');
    $("#overlay").slideToggle()

  });
  $("#apibutton").click(function (e) {
    $("#keybox").slideToggle()
  })
  $("#keypress").click(function (e) {
    $("#keybox").slideToggle()
  })
  $("#keypress").click(function (e) {
    $("#keybox").slideToggle()
  })
  $('#keybox').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      $("#overlay").slideUp()
      $("#userdeets").slideDown();
      getUser($("#textboxapikey").val())
    }
  });

}
async function getUser(key) {
  console.log(key + " found")
  // $.ajax({
  //   url: 'https://api.medium.com/v1/me',
  //   type: 'GET',
  //   dataType: 'json',
  //   crossDomain:true,
  //   contentType: "application/json; charset=utf-8",
  //   async:true,
  //   beforeSend: function (xhr) {
  //     xhr.setRequestHeader("Access-Control-Allow-Origin", "https://api.medium.com/v1/me");
  //     xhr.setRequestHeader('Authorization', 'Bearer ' + key);
  //   },
  //   success: function (res) {
  //     console.log('found user ' + res.data.name)
  //     $("#username").text(res.data.name)
  //     $("#userprofile").attr("src",res.data.imageUrl)
  //   },
  //   error: function (err) {},
  // });
var settings = {
  "url": "https://api.medium.com/v1/me",
  "method": "GET",
  "timeout": 0,
  "headers": {
    "Authorization": "Bearer "+key,
    "Cookie": "sid=1:0WuE6dxD205uISDPWTHx60dAtI+m8Zr0meb/ZjM9yG++Jp9ubVb19EVrAfuDHkE2; uid=lo_71be17e14468"
  },
  "processData": false,
  "mimeType": "multipart/form-data",
  "contentType": false
};

$.ajax(settings).done(function (response) {
  console.log(response);
});
}

function customiseTrix() {
  $(".trix-button-group--file-tools").hide()
  disablers = [
    "decreaseNestingLevel",
    "increaseNestingLevel",
    "attachFiles",
    "strike",
    "quote",
    "code"
  ]
  actions = {}
  for (let i = 0; i < disablers.length; i++) {
    $("[data-trix-action=" + disablers[i] + "]").css({
      "display": "none"
    })
    $("[data-trix-attribute=" + disablers[i] + "]").css({
      "display": "none"
    })
    actions[disablers[i]] = false
  }
  const element = document.querySelector("trix-editor");
  element.editor.element.editorController.toolbarController.updateActions(actions);
}

async function initDB() {
  // const db = await idb.openDB('wryter', 1, async function (upgradeDb) {
  //   console.log('making a new object store');
  //   await upgradeDb.createObjectStore('autosave');
  // });
  // db.close()
  // db.version(1).stores({
  //   autosave: "data,date"
  // });
  db.get('config').catch(function (err) {
    if (err.name === 'not_found') {
      db.put({
        _id: 'config',
        autosave: ''
      }).then(function (response) {
        console.log('initiated db')
      }).catch(function (err) {
        console.log(err);
      });
    } else { // hm, some other error
      throw err;
    }
  }).then(function (configDoc) {
    console.log(configDoc.autosave)
    if (configDoc.autosave != "") {
      console.log("autosave exists!")
      $("[trix-id=1]").html(configDoc.autosave)
    }
  }).catch(function (err) {
    console.log(err)
  });

}
async function createStore(database, storename) {
  // let db = await idb.openDB(database, 1)
  // var store;
  // try {
  //   store = request.transaction.objectStore(storename);
  // } catch (e) {
  //   store = db.createObjectStore(storename);
  // }
}

function getArticles() {
  fetchedarticles = []
}

async function autoSave() {
  let input = $("#trix-input-1").val()
  if (input != "") {
    console.log(input)
    updateDB("config", "autosave", input)
  }
  setTimeout(function () {
    if (autosave) {
      autoSave()
    }
  }, 5000)
}

async function updateDB(store, key, value) {
  db.get(store).then(function (doc) {
    doc[key] = value
    return db.put(doc); // <-- no need to include rev as the second argument
  }).then(function (doc) {
    console.log(doc)
  })
}
// On document ready, run setup scripts
$(document).ready(function () {
  initDB()
  setKeyHandlers()
  customiseTrix()
  getArticles()
  autoSave()
});