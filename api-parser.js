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

exports.getLinks = getLinks;
exports.isLeafNode = isLeafNode;
exports.getName = getName;
exports.isPollingPlace = isPollingPlace;
exports.isCityDistrict = isCityDistrict;
exports.isMunicipality = isMunicipality;
exports.isCounty = isCounty;
exports.isSamiDistrict = isSamiDistrict;