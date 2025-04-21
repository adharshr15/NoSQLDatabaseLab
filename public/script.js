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

    try {
        const res = await fetch('/ballot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voterID, regPIN, firstChoice, secondChoice, thirdChoice })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to submit ballot.');
        }

        const data = await res.json();
        alert(data.message || "Submitted successfully!");
    } catch (err) {
        console.error(err);
        alert("There was an error submitting your ballot: " + err.message);
    }
});
