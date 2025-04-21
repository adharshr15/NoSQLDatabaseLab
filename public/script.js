document.getElementById("votingForm").addEventListener("submit", async function(event) {
    event.preventDefault();


    const voterID = document.getElementById("voterID").value;
    const regPIN = document.getElementById("regPIN").value;
    const firstChoice = document.getElementById("selection1").value;
    const secondChoice = document.getElementById("selection2").value;
    const thirdChoice = document.getElementById("selection3").value;


    if (!firstChoice || !secondChoice || !thirdChoice) {
        alert("Please select a value for all dropdowns.");
        return;
    }


    if (firstChoice === secondChoice || secondChoice === thirdChoice || thirdChoice === firstChoice) {
        alert("Each selection must have a different value.");
        return;
    }


    const res = await fetch('/api/ballots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterID, regPIN, firstChoice, secondChoice, thirdChoice })
    });


    try {
        // Send data to the server
        const res = await fetch('/api/ballots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voterID, regPIN, firstChoice, secondChoice, thirdChoice })
        });

        // Check if the response is successful
        if (!res.ok) {
            throw new Error('Failed to submit ballot.');
        }

        // Parse the response data
        const data = await res.json();

        // Show a success message or the message returned by the server
        alert(data.message || "Submitted successfully!");

    } catch (err) {
        // Handle any errors that occur during the fetch request
        console.error(err);
        alert("There was an error submitting your ballot.");
    }
});
