const today = new Date().toISOString().split("T")[0];
console.log(today);

document.getElementById("dueDate").setAttribute("min", `${today}`);
