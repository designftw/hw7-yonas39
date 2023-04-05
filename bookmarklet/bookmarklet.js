(function () {
  var inputs = document.querySelectorAll("input");
  inputs.forEach(function (input) {
    if (
      input.type === "password" ||
      input.getAttribute("data-toggle-password") === "true"
    ) {
      input.type = input.type === "password" ? "text" : "password";
      input.setAttribute(
        "data-toggle-password",
        input.type === "password" ? "false" : "true"
      );
    }
  });
})();
