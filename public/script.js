document.getElementById("votingForm").addEventListener("submit", function(event) {
    const selection1 = document.getElementById("selection1").value;
    const selection2 = document.getElementById("selection2").value;
    const selection3 = document.getElementById("selection3").value;

    // check if all dropdowns have a value selected
    if (!selection1 || !selection2 || !selection3) {
        alert("Please select a value for all dropdowns.");
        event.preventDefault(); 
        return;
    }

    // check if any selections are the same
    if (selection1 == selection2 || selection2 == selection3 || selection3 == selection1) {
        alert("Each selection must have a different value.");
        event.preventDefault();
        return;
    }

    alert("Form submitted successfully!");
})