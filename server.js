const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
	origin: "*",        // Allow all origins
	methods: "*",       // Allow all HTTP methods
	allowedHeaders: "*"
}));

// Map subdomains to target URLs
const targetMap = {
	cmu: "http://127.0.0.1:3001",  // Default domain without subdomain
	ajk: "http://127.0.0.1:3002",
	ba: "http://127.0.0.1:3003",
	gb: "http://127.0.0.1:3004",
	kp: "http://127.0.0.1:3005",
	sindh: "http://127.0.0.1:3006",
};

app.use((req, res, next) => {
	// Extract hostname from request headers
	const host = req.headers.host; // e.g. ajk.lmis.cmu.gov.pk or lmis.cmu.gov.pk

	if (!host) {
		return res.status(400).json({ error: "Host header missing" });
	}

	// Extract subdomain - domain is lmis.cmu.gov.pk
	// Examples:
	// ajk.lmis.cmu.gov.pk -> subdomain = "ajk"
	// lmis.cmu.gov.pk -> no subdomain, so default to "cmu"

	// Define your root domain
	const rootDomain = "lmis.cmu.gov.pk";

	let subdomain = null;

	if (host === rootDomain || host === `www.${rootDomain}`) subdomain = "cmu";
	else if (host.endsWith(`.${rootDomain}`)) subdomain = host.slice(0, host.length - rootDomain.length - 1);

	if (!subdomain || !targetMap[subdomain]) return res.status(400).json({ error: `Invalid or unsupported subdomain: ${subdomain}` });

	// Construct the redirect URL
	let redirectUrl = targetMap[subdomain];

	// Add the original path and query string to the redirect
	if (req.url && req.url !== '/') redirectUrl += req.url;

	// Perform 301 (permanent) redirect
	return res.redirect(301, redirectUrl);
});

app.listen(3000, () => {
	console.log("Gateway running on port 3000 - Redirecting based on subdomains");
});