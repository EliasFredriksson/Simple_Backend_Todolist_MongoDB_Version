class Data {
    changeProperty(whichPropery, newValue) {
        if (this.hasOwnProperty(whichPropery)) {
            if (String(newValue).length > 0) {
                this[whichPropery] = newValue;
                console.log(
                    `Successfully changed property:\n${whichPropery} -> ${newValue}`
                );
                return true;
            } else {
                console.log(
                    `You need to enter a non-empty value for property:\n${whichPropery}`
                );
                return false;
            }
        } else {
            console.log(
                `Object "User" does not have property:\n${whichPropery}`
            );
            return false;
        }
    }
}

module.exports = Data;
