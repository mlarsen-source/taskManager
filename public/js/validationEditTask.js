document.getElementById("edit-task-form").onsubmit = (event) => {
  let fields = ["title", "description", "dueDate", "location"];
  let isValid = true;

  const isDeletePressed =
    event.submitter && event.submitter.id === "delete-btn";

  if (!isDeletePressed) {
    fields.forEach((field) => {
      document.getElementById(`err-${field}`).style.display = "none";
      document.getElementById(field).classList.remove("form-input-err");
    });

    fields.forEach((field) => {
      let input = document.getElementById(field);
      if (input.value.trim() === "") {
        document.getElementById(`err-${field}`).style.display = "block";
        input.classList.add("form-input-err");
        isValid = false;
      }
    });
  }

  return isValid;
};

function isDeleteBtn() {}
