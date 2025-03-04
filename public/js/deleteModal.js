document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("dlt-modal");
  const deleteBtn = document.getElementById("delete-btn");
  const closeBtn = document.getElementById("close-modal");
  const deleteConfirmBtn = document.getElementById("confirm-delete");

  deleteBtn.addEventListener("click", function () {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  deleteConfirmBtn.addEventListener("click", function () {
    deleteBtn.type = "submit";
    deleteBtn.click();
    modal.style.display = "none";
  });
});
