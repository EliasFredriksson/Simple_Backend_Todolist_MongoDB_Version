// ####### HELPERS #######
function getNewId(list) {
    let maxId = 0;
    for (const item of list) {
        if (item.id > maxId) {
            maxId = item.id;
        }
    }
    return maxId + 1;
}

module.exports.getNewId = getNewId;
