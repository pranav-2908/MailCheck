
const emailInput = document.getElementById("email");
const validateBtn = document.getElementById("validateBtn");
const result = document.getElementById("result");
const report = document.getElementById("report");
const checksContainer = document.getElementById("checks");

validateBtn.addEventListener("click", scanEmail);

async function scanEmail() {
    const email = emailInput.value.trim();

    if (!email) {
        result.textContent = "Please enter an email address.";
        result.style.color = "#ff7777";
        report.classList.add("hidden");
        return;
    }

    validateBtn.disabled = true;
    validateBtn.textContent = "Scanning...";
    result.textContent = "Analyzing email address...";
    result.style.color = "#65d9ff";
    report.classList.add("hidden");

    try {
        const response = await fetch("/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        result.textContent = data.valid
            ? "✓ Email passed basic validation"
            : "✕ Email failed basic validation";

        result.style.color = data.valid ? "#65e6a5" : "#ff7777";

        checksContainer.innerHTML = "";

        for (const [name, passed] of Object.entries(data.checks)) {
            let status;
            let statusClass;

            if (passed === true) {
                status = "✓ Passed";
                statusClass = "passed";
            } else if (passed === false) {
                status = "✕ Failed";
                statusClass = "failed";
            } else {
                status = "— Not checked";
                statusClass = "unavailable";
            }

            const item = document.createElement("div");
            item.className = "check-item";

            const label = document.createElement("span");
            label.textContent = name;

            const value = document.createElement("span");
            value.className = `check-status ${statusClass}`;
            value.textContent = status;

            item.append(label, value);
            checksContainer.appendChild(item);
        }

        report.classList.remove("hidden");

    } catch (error) {
        result.textContent = "Unable to connect to the server.";
        result.style.color = "#ff7777";
    }

    validateBtn.disabled = false;
    validateBtn.textContent = "Scan Email →";
}

emailInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        scanEmail();
    }
});
