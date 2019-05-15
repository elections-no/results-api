function getLinks(document) {
    const links = document["_links"];
    const related = links["related"];
    return related;
  }
  
  function getName(document) {
    const id = document["id"];
    const name = id["navn"];
    return name;
  }
  
  function isPollingPlace(document) {
    const id = document["id"];
    const level = id["nivaa"];
    return level === "stemmekrets";
  }
  
  function isDistrict(document) {
    const id = document["id"];
    const level = id["nivaa"];
    return level === "bydel";
  }
  
  function isMunicipality(document) {
    const id = document["id"];
    const level = id["nivaa"];
    return level === "kommune";
  }
  
  function isCounty(document) {
    const id = document["id"];
    const level = id["nivaa"];
    return level === "fylke";
  }
  
  function isSamiDistrict(document) {
    const id = document["id"];
    const level = id["nivaa"];
    return level === "samevalgdistrikt";
  }

  exports.getLinks = getLinks;
  exports.getName = getName;
  exports.isPollingPlace = isPollingPlace;
  exports.isDistrict = isDistrict;
  exports.isMunicipality = isMunicipality;
  exports.isCounty = isCounty;
  exports.isSamiDistrict = isSamiDistrict;