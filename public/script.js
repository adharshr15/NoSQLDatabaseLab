document.getElementById("votingForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const voterID = document.getElementById("voterID").value;
    const regPIN = document.getElementById("regPIN").value;
    const firstChoice = document.getElementById("selection1").value;
    const secondChoice = document.getElementById("selection2").value;
    const thirdChoice = document.getElementById("selection3").value;

    if (!voterID || !regPIN) {
        alert("Please enter your Voter ID and Registration PIN.");
        return;
    }

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
            body: JSON.stringify({
                voterID,
                regPIN,
                election: { 
                    electionID: "2025-general", 
                    name: "2025 General Election", 
                    date: new Date().toISOString() 
                }, 
                rankings: [
                    { 
                        rank: 1, 
                        nominee: {
                            nomineeID: firstChoice.replace(/\s+/g, '-').toLowerCase(),
                            name: firstChoice,
                            party: getNomineeParty(firstChoice)
                        }
                    },
                    { 
                        rank: 2, 
                        nominee: {
                            nomineeID: secondChoice.replace(/\s+/g, '-').toLowerCase(),
                            name: secondChoice,
                            party: getNomineeParty(secondChoice)
                        }
                    },
                    { 
                        rank: 3, 
                        nominee: {
                            nomineeID: thirdChoice.replace(/\s+/g, '-').toLowerCase(),
                            name: thirdChoice,
                            party: getNomineeParty(thirdChoice)
                        }
                    }
                ]
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || err.details || 'Failed to submit ballot.');
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
        console.log("Fetched ballot:", data);

        // Handle the ballot data structure correctly
        const sorted = data.rankings.sort((a, b) => a.rank - b.rank);
        document.getElementById("regPIN").value = data.voter.regPIN;
        document.getElementById("selection1").value = sorted[0]?.nominee.name || '';
        document.getElementById("selection2").value = sorted[1]?.nominee.name || '';
        document.getElementById("selection3").value = sorted[2]?.nominee.name || '';

    } catch (err) {
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
            // Clear form after successful deletion
            document.getElementById("regPIN").value = '';
            document.getElementById("selection1").value = '';
            document.getElementById("selection2").value = '';
            document.getElementById("selection3").value = '';
        } else {
            alert(`Failed to delete ballot: ${result.error || 'Unknown error'}`);
        }
    } catch (err) {
        console.error("Error deleting ballot:", err);
        alert("An error occurred while trying to delete the ballot.");
    }
});

// Helper function to assign a party to each nominee
function getNomineeParty(nominee) {
    const partyMap = {
        "William Henry Harrison": "Whig Party",
        "Taylor Swift": "Independent",
        "Abraham Lincoln": "Republican",
        "Mr. Bean": "Comedy Party",
        "George Washington": "Federalist"
    };
    
    return partyMap[nominee] || "Independent";
}