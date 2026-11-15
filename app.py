
from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)

disposable_domains = [
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com"
]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/validate", methods=["POST"])
def validate():
    data = request.get_json()
    email = data.get("email", "").strip()

    pattern = r'^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
    syntax_valid = bool(re.fullmatch(pattern, email))

    if not syntax_valid:
        return jsonify({
            "valid": False,
            "checks": {
                "Email syntax": False,
                "Domain format": False,
                "Disposable email": None,
                "MX record": None
            }
        })

    domain = email.split("@")[1]

    domain_valid = "." in domain and not domain.startswith(".") and not domain.endswith(".")

    disposable = domain in disposable_domains

    return jsonify({
        "valid": syntax_valid and domain_valid,
        "checks": {
            "Email syntax": syntax_valid,
            "Domain format": domain_valid,
            "Disposable email": not disposable,
            "MX record": None
        },
        "domain": domain
    })

if __name__ == "__main__":
    app.run(debug=True)
