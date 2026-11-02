const { useState } = React;

function RegistrationForm() {
  // get items from the cart
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // variables for the form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [participation, setParticipation] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // messages and JSON info
  const [message, setMessage] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // user submit
  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setJsonOutput("");
    // make sure everything is filled out correctly
    if (name.trim() === "") {
      setMessage("Please enter your name.");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email.");
      return;
    }
    if (participation == "") {
      setMessage("Please select a participation type.");
      return;
    }
    if (cart.length == 0) {
      setMessage("Please add an event to your cart first.");
      return;
    }
    if (!confirmed) {
      setMessage("Please confirm your attendance.");
      return;
    }

    // put all the registration info together
    const registration = {
      name: name,
      email: email,
      participation: participation,
      events: cart,
      confirmed: confirmed
    };

    // turn the registration into JSON
    const jsonData = JSON.stringify(registration, null, 2);

    // show the JSON on the page and in the console
    setJsonOutput(jsonData);
    console.log("Registration JSON:", jsonData);

    setSubmitting(true);

    // send the registration to the API
    fetch("put the json url here please", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonData
    })
    .then(function(response) {
      // check if request worked
      if (!response.ok) {
        throw new Error("Request failed");
      }
      return response.json();
    })
    .then(function(data) {
      console.log("API response:", data);
      setMessage("Registration submitted successfully!");
      setSubmitting(false);
    })
    .catch(function(error) {
      // show an error
      console.log(error);
      setMessage("Error submitting registration.");
      setSubmitting(false);
    });
  }

  return (
    <div className="card shadow-sm mt-4 mb-5">
      <div className="card-body p-4">
        <h2>Finalize Event Registration</h2>
        <p>Enter your information to confirm your attendance.</p>
        <h4 className="mt-4">Selected Events</h4>

        {cart.length == 0 ? (
          <p>No events selected.</p>
        ) : (
          <ul>
            {cart.map(function(item, index) {
              return (
                <li key={index}>
                  {item.description} - ${Number(item.price).toFixed(2)}
                </li>
              );
            })}
          </ul>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={function(event) {
                setName(event.target.value);
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={function(event) {
                setEmail(event.target.value);
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Participation Type</label>
            <select
              className="form-select"
              value={participation}
              onChange={function(event) {
                setParticipation(event.target.value);
              }}
            >
              <option value="">Select an option</option>
              <option value="In-Person">In-Person</option>
              <option value="Virtual">Virtual</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={confirmed}
              onChange={function(event) {
                setConfirmed(event.target.checked);
              }}
            />
            <label className="form-check-label">
              I confirm my attendance.
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Submitting" : "Confirm Registration"}
          </button>
        </form>

        {message !== "" && (
          <div className="alert alert-info mt-3">
            {message}
          </div>
        )}

        {jsonOutput !== "" && (
          <div className="mt-4">
            <h4>Registration JSON</h4>
            <pre className="bg-light p-3 border rounded"
                 style={{whiteSpace: "pre-wrap"}}>
              {jsonOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// show React form on shipping page
const root = ReactDOM.createRoot(
  document.getElementById("registration-root")
);

root.render(<RegistrationForm />);
