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
        const checkRes = await fetch(`/ballot?voterID=${encodeURIComponent(voterID)}`);
        console.log("checkRes: ", checkRes);

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

document.getElementById('retrieveButton').addEventListener('click', async function (event) {
    event.preventDefault();

    const voterID = document.getElementById("voterID").value;

    if (!voterID) {
        alert("Please enter a valid voter ID");
        return;
    }

    try {
        const res = await fetch(`/ballot/${encodeURIComponent(voterID)}`);

        if (!res.ok) {
            const err = await res.json();
            alert("Ballot not found, please enter a valid voter ID");
            throw new Error(err.error || 'Ballot not found.');
        }

        const data = await res.json();
        console.log("Fetched ballots:", data);

        // const ballot = data.find(entry => entry.voterID === voterID);

        // console.log("Ballot: ", ballot);

        // if (!ballot) {
        //     alert("No ballot found for the provided Voter ID.");
        //     return;
        // }

        // update fields with specified ballot info

        document.getElementById("regPIN").value = data.regPIN;
        document.getElementById("selection1").value = data.firstChoice;
        document.getElementById("selection2").value = data.secondChoice;
        document.getElementById("selection3").value = data.thirdChoice;

    } catch (e) {
        console.error(err);
        alert("There was an error retrieving your ballot: " + err.message);
    }
    

});

document.getElementById('deleteButton').addEventListener('click', async function (event) {
    event.preventDefault();

    const voterID = document.getElementById("voterID").value;

    if (!voterID) {
        alert("Please enter a valid voter ID");
        return;
    }

    try {
        const res = await fetch(`/ballot/${encodeURIComponent(voterID)}`, {
            method: 'DELETE',
        });

        const result = await res.json();

        if (res.ok) {
            alert("Ballot deleted successfully.");
        } else {
            alert(`Failed to delete ballot: ${result.error || 'Unknown error'}`);
        }
    } catch (e) {
        console.error("Error deleting ballot:", e);
        alert("An error occurred while trying to delete the ballot.");
    }
});
