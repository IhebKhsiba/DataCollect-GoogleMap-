document.addEventListener("DOMContentLoaded", function () {
  if (window.location.href.includes("google.com/maps")) {
    var searchBar = document.querySelector("#searchboxinput");
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.action == "collectData") {
    clickButton();
    setTimeout(ScrollAutomatique, 500);
  }
});

let interval;
function ScrollAutomatique() {
  interval = setInterval(function () {
    let ScrollVariable = document.querySelector(".m6QErb.DxyBCb[role='feed']");
    console.log(ScrollVariable);
    console.log(ScrollVariable.scrollHeight);
    if (ScrollVariable) {
      ScrollVariable.scrollBy({
        top: 1500,
        behavior: "smooth",
      });
      var stop = document.querySelector(".HlvSq");
      if (stop) {
        clearInterval(interval);
        collectData();
      }
      console.log("scrolling...");
    }
  }, 1000);
}

function clickButton() {
  var button = document.querySelector(".oyBCed");
  if (button) {
    button.click();
  } else {
    const boutons = document.querySelectorAll(".K4UgGe");
    boutons.forEach((bouton) => {
      const titre = bouton.getAttribute("aria-label").split("·")[0];
      const note = bouton.getAttribute("aria-label").split("·")[1];
      const nombreAvis = bouton.getAttribute("aria-label").split("·")[2];
      const description = bouton
        .getAttribute("aria-label")
        .split("·")
        .slice(3)
        .join("·");

      const tableauInfo = [[titre, note, nombreAvis, description]];

      const tableau = document.createElement("table");
      tableau.setAttribute("border", "1");

      tableauInfo.forEach((rowData) => {
        const row = document.createElement("tr");
        rowData.forEach((cellData) => {
          const cell = document.createElement("td");
          cell.appendChild(document.createTextNode(cellData));
          row.appendChild(cell);
        });
        tableau.appendChild(row);
      });

      document.body.appendChild(tableau);
      displayData(tableau);
      console.log(tableauInfo);

      chrome.runtime.sendMessage({ action: "tabsData", data: tableauInfo });
    });
  }
}

window.addEventListener("load", clickButton);

function collectData() {
  var monumentElements = document.querySelectorAll(".qBF1Pd.fontHeadlineSmall");
  var etoileElements = document.querySelectorAll(".ZkP5Je");
  var descriptionElements = document.querySelectorAll(".UaQhfb.fontBodyMedium");

  var extractedData = [];

  monumentElements.forEach(function (monumentElement, index) {
    var data = {
      monument: monumentElement.innerText.trim(),
      starsAndReviews: "",
      description: "",
      openingHours: "",
    };

    // Extraction des étoiles et des avis
    if (etoileElements[index]) {
      var starsLabel = etoileElements[index].getAttribute("aria-label");
      data.starsAndReviews = starsLabel;
    }

    // Extraction de la description
    var descriptionElement = descriptionElements[index];
    if (descriptionElement) {
      var descriptionText = descriptionElement
        .querySelector(".W4Efsd:nth-child(2) span")
        .innerText.trim();
      console.log(descriptionText);
      data.description = descriptionText;
    }

    // Extraction des horaires d'ouverture et de fermeture
    if (descriptionElement) {
      var openingHoursSpan = descriptionElement.querySelector(
        "span[style*='color: rgba(24,128,56,1.00)']"
      );
      var closingHoursSpan = descriptionElement.querySelector(
        "span[style*='color: rgba(217,48,37,1.00)']"
      );

      if (openingHoursSpan) {
        data.openingHours = openingHoursSpan.innerText.trim();
      }

      if (closingHoursSpan) {
        data.openingHours = closingHoursSpan.innerText.trim();
      }

      if (!openingHoursSpan && !closingHoursSpan) {
        data.openingHours = "Aucune information sur les horaires.";
      }
    }

    extractedData.push(data);
  });

  chrome.runtime.sendMessage({ action: "sendData", data: extractedData });
  displayData(extractedData);
}

function displayData(data) {
  console.log(data);
  chrome.runtime.sendMessage({ data: data });
}

// Appel initial de collectData
collectData();
