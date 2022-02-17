function checkValidTodo(description, date, time, prio) {
    // Check so all values are provided.
    if (!description || !date || !time || !prio) return false;

    // Check that the strings contain something.
    if (description.length <= 0) return false;
    if (date.length <= 0) return false;
    if (time.length <= 0) return false;
    if (prio.length <= 0) return false;

    // Check that the date has valid format.
    let newDate = new Date(date + ":" + time);
    if (newDate.toString() == "Invalid Date") return false;

    // Check that provided prio is high, mid or low.
    if (!(prio === "High" || prio === "Mid" || prio === "Low")) return false;

    // If we get here, the todo information is valid.
    return true;
}

module.exports = {
    checkValidTodo,
};
