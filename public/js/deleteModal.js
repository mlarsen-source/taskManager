document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("dlt-modal");
  const deleteBtn = document.getElementById("delete-btn");
  const closeBtn = document.getElementById("close-modal");
  console.log("object");
  // Open modal when button is clicked
  deleteBtn.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // Close modal when 'x' button is clicked
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close modal when clicking outside of the modal content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
