export function validateForm(data, options = {}) { 
  // Store all the validation errors in an array
  const errors = [];

  // Validate task title is not blank
  if (!data.title || data.title.trim() === "") {
    errors.push("Task Title must not be blank");
  }

  // Validate task description is not blank
  if (!data.description || data.description.trim() === "") {
    errors.push("Task Description must not be blank");
  }

  // Validate due date is not blank and is a valid timestamp
  if (!data.dueDate || isNaN(Date.parse(data.dueDate))) {
    errors.push("A valid Due Date is required");
  } else {
    const today = new Date();
    const dueDate = new Date(data.dueDate);
    
    // Ensure due date is in the future
    if (dueDate < today) {
      errors.push("Due Date cannot be in the past.");
    }
  }

  // Validate location is not blank
  if (!data.location || data.location.trim() === "") {
    errors.push("Task Location must not be blank");
  }

  // Validate priority selected
  const validPriorities = ["Low", "Medium", "High"];
  if (!validPriorities.includes(data.priority)) {
    errors.push("A valid Priority must be selected");
  }

  // Validate task type selected
  const validTypes = ["General", "Work", "School", "Personal", "Financial", "Health", "Travel"];
  if (!validTypes.includes(data.type)) {
    errors.push("A valid Task Type must be selected");
  }

  // validate status only if `options.checkStatus` is true (when function called from update task route )
  if (options.checkStatus) {
    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (!validStatuses.includes(data.status)) {
      errors.push("A valid Status must be selected");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

