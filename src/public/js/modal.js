window.onload = () => {
    initialize();
};

function initialize() {
    document.getElementById("modal").style.display = "none";
    document
        .getElementById("modal-show-button")
        .addEventListener("click", () => {
            document.getElementById("modal").style.display = "block";
            setTimeout(() => {
                document.getElementById("modal").className = "show";
                document.getElementById("modal-content").className = "slide-in";
            }, 0);
        });
    document
        .getElementById("modal-close-button")
        .addEventListener("click", () => {
            document.getElementById("modal").className = "hide";
            document.getElementById("modal-content").className = "slide-out";
            setTimeout(() => {
                document.getElementById("modal").style.display = "none";
            }, 300);
        });
}
