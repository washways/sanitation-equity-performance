Sanitation Affordability, Equity & Performance Explorer - Defender-friendly build

Open:
 index.html

Why this package exists
-----------------------
The earlier single-file build contained browser code that generated CSV/PNG files
using Blob(), URL.createObjectURL(), temporary download links and programmatic
clicks. Those are legitimate export techniques, but the same primitives are also
used by malicious HTML downloaders and can trigger heuristic antivirus detection.

This build removes:
- programmatic file creation/download
- Blob / createObjectURL download code
- localStorage caching
- the data-URI favicon
- all externally loaded JavaScript

The app still connects only to these public data APIs:
- https://api.worldbank.org
- https://open.er-api.com

There are no iframes, embedded executables, eval(), obfuscated code, external
script libraries, PowerShell/cmd calls, ActiveX objects, or executable downloads.

A restrictive Content-Security-Policy is included in index.html.

SHA-256
-------
index.html 7b4a23d89adb2b136893f970ec20c93e31006236df50d45c142d06792ecd5572
app.js b988addd8f65085b3da62750e04eb6d32a22250c79cdeba8b70b9182e32e2050
styles.css 355e9b113b2b3f7d3bfcf2443813aac2a3b84e16cacb795240086a71164c0921

Note
----
This is a static code review and hardening step, not a Microsoft Defender
certification. If Defender still flags the package, note the exact detection
name and submit the file to Microsoft as a suspected false positive.


GitHub Pages
------------
Publish the contents of this folder at the repository root, or configure GitHub
Pages to serve this folder. `index.html` is the entry page and `.nojekyll` is
included for plain static hosting.

Site title:
Sanitation Affordability, Equity & Performance Explorer

Favicon:
favicon.svg with favicon.ico fallback.

World Bank browser compatibility
--------------------------------
The World Bank Indicators API does not reliably expose CORS headers for direct
browser fetch() calls. This publishing build uses the World Bank API's documented
JSONP output (`format=jsonP&prefix=...`) for country metadata and indicator data.
The API base is explicitly `/v2`, avoiding the redirect/double-slash requests
that were visible in the earlier browser console.

Browser API compatibility
-------------------------
The open exchange-rate request now uses the documented endpoint:
https://open.er-api.com/v6/latest/USD

World Bank JSONP callbacks now use simple alphanumeric callback names and
`format=jsonp`. Global indicator queries request `country/all` and filter the
44 LDCs locally, avoiding long semicolon-delimited country paths. WDI indicator
calls explicitly use source 2.

If live World Bank data are unavailable, the LDC page still renders the embedded
World Bank sanitation-cost distribution and independent JMP inequality benchmark.

Published runtime now reads only ./data/snapshot.json. Third-party API requests occur only in scripts/update_snapshot.py during an explicit data refresh.
