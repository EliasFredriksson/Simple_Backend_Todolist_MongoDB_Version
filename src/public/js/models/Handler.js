const fs = require("fs");
class Handler {
    constructor(filePath, objectType) {
        this.filePath = filePath;
        this.objectType = objectType;
        this.readData();
        this.error = "";
    }

    readData() {
        let data = fs.readFileSync(this.filePath, {
            encoding: "utf8",
        });
        let parsedData = JSON.parse(data);
        this.data = parsedData.map((entry) => {
            return new this.objectType(entry);
        });
    }

    storeData() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 4));
        this.readData();
    }

    delete(id) {
        let foundIndex = this.data.findIndex((p) => p.id === id);
        if (foundIndex != -1) {
            this.data.splice(foundIndex, 1);
            this.storeData();
            return true;
        }
        this.error = `No ${this.objectType.name} with ID: ${id} found.`;
        return false;
    }

    edit(id, property, newValue) {
        let foundIndex = this.data.findIndex((p) => p.id === id);
        if (foundIndex != -1) {
            if (this.data[foundIndex].changeProperty(property, newValue)) {
                this.storeData();
                return true;
            } else {
                this.error = `${this.objectType.name} with ID: ${id} does not have attribute: ${property}.`;
                return false;
            }
        }
        this.error = `No ${this.objectType.name} with ID: ${id} found.`;
        return false;
    }

    getById(id) {
        let parsedId = parseInt(id);
        let foundEntry = this.data.find((entry) => {
            return entry.id == parsedId;
        });
        if (foundEntry === undefined) {
            this.error = `No ${this.objectType.name} with ID: ${id} found.`;
        }
        return foundEntry;
    }
}

module.exports = Handler;
