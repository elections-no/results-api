const assert = require("assert");

function getLinks(document) {
    const links = document["_links"];
    const related = links["related"];
    return related;
}

function isLeafNode(document) {
    return getLinks(document).length === 0;
}

function getName(document) {
    const id = document["id"];
    const name = id["navn"];
    return name;
}

function getNumber(document) {
    const id = document["id"];
    const nr = id["nr"];
    return nr;
}

function getLevel(document) {
    const id = document["id"];

    if (id) {
        assert(document.id);
        const level = id["nivaa"];
        return level;
    }

    assert.fail("ERROR: Could not read id from document");
    return "Unknown";
}

function isPollingPlace(document) {
    const level = getLevel(document);
    return level === "stemmekrets";
}

function isCityDistrict(document) {
    const level = getLevel(document);
    return level === "bydel";
}

function isMunicipality(document) {
    const level = getLevel(document);
    return level === "kommune";
}

function isCounty(document) {
    const level = getLevel(document);
    return level === "fylke";
}

function isSamiDistrict(document) {
    const level = getLevel(document);
    return level === "samevalgdistrikt";
}

const SAMI_POLLING_PLACE_TYPE = 1;
const REGULAR_POLLING_PLACE_TYPE = 2;

function getPollingPlaceType(document) {
  if (isSamiDistrict(document)) return SAMI_POLLING_PLACE_TYPE;
  else return REGULAR_POLLING_PLACE_TYPE;
}

function getPollingPlaceInfo(document, parentInfo) {
    let info = {
      nr: '',
      name: '',
      city_district: '',
      municipality: '',
      county: '',
      polling_place_type: 0
    };

    info.nr = getNumber(document);
    info.name = getName(document);
    info.polling_place_type = getPollingPlaceType(document);

    if (parentInfo.city_district) info.city_district = parentInfo.city_district;
    if (parentInfo.municipality) info.municipality = parentInfo.municipality;
    if (parentInfo.county) info.county = parentInfo.county;

    return info;
}

exports.getLinks = getLinks;
exports.isLeafNode = isLeafNode;
exports.getName = getName;
exports.getNumber = getNumber;
exports.isPollingPlace = isPollingPlace;
exports.isCityDistrict = isCityDistrict;
exports.isMunicipality = isMunicipality;
exports.isCounty = isCounty;
exports.isSamiDistrict = isSamiDistrict;
exports.getPollingPlaceInfo = getPollingPlaceInfo;
exports.SAMI_POLLING_PLACE_TYPE = SAMI_POLLING_PLACE_TYPE;
exports.REGULAR_POLLING_PLACE_TYPE = REGULAR_POLLING_PLACE_TYPE;