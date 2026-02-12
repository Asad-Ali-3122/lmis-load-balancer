const express = require("express");
const cors = require("cors");

const app = express();

// Allow all CORS (fully open)
app.use(cors());
app.options("*", cors());

// Map subdomains to target URLs
const targetMap = {
	lmis: "http://127.0.0.1:3001",
	ajk: "http://127.0.0.1:3002",
	ba: "http://127.0.0.1:3003",
	gb: "http://127.0.0.1:3004",
	kp: "http://127.0.0.1:3005",
	sindh: "http://127.0.0.1:3006",
};

app.use((req, res) => {

	const hostname = req.headers.origin.replace(/^https?:\/\//, ''); // "lmis.cmu.gov.pk"

	// Split by dots
	const parts = hostname.split('.'); // ["lmis", "cmu", "gov", "pk"]

	// The first part is the subdomain
	const subdomain = parts[0];

	console.log(subdomain);
	console.log(req.originalUrl);



	if (!targetMap[subdomain]) {
		return res.status(400).json({ error: `Unsupported subdomain: ${subdomain}` });
	}

	const redirectUrl = targetMap[subdomain] + req.originalUrl;

	console.log(`balancer hit: ${subdomain} to ${redirectUrl}`)

	return res.redirect(302, redirectUrl); // Use 301 in production if needed
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Gateway running on port ${PORT}`);
});
