function myFunction() {
  $("#dropdownMenu").toggleClass("show");
}

$(window).on("click", function (e) {
  if (!$(e.target).closest(".dropbtn").length && !$(e.target).closest(".dropdown-menu").length) {
    $("#dropdownMenu").removeClass("show");
  }
});
