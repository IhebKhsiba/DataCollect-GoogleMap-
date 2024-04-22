document.getElementById("monBouton").addEventListener("click", function () {
  collecterDonnees();
});

function collecterDonnees() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tabId = tabs[0].id;

    chrome.tabs.sendMessage(tabId, {
      action: "collectData",
      message: "en cours",
    });
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "receiveData") {
    // Traitez les données reçues et affichez-les
    afficherDonnees(message.data);
  }
});

function afficherDonnees(donnees) {
  var donneesDiv = document.getElementById("donnees");
  var html = "<h2>Données Collectées</h2>";

  donnees.forEach(function (donnee) {
    html += "<p><strong>Monument:</strong> " + donnee.monument + "</p>";
    html +=
      "<p><strong>Étoiles et avis:</strong> " + donnee.starsAndReviews + "</p>";
    html += "<p><strong>Description:</strong> " + donnee.description + "</p>";
    html += "<p><strong>Horaires:</strong> " + donnee.openingHours + "</p>";
    html += "<hr>";
  });

  donneesDiv.innerHTML = html;
}

function downloadJSON(data, filename) {
  var json = JSON.stringify(data);
  var blob = new Blob([json], { type: "application/json" });
  var url = URL.createObjectURL(blob);

  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
