# World rules: p0-v1

The observation window is the `asOf` UTC day plus the six preceding UTC days. Each supported activity on a day emits one `workday_observed` event; repeated work on that day does not create more facade illumination.

`code_pushed`, `pull_request_opened`, `pull_request_merged`, and `release_published` can light a day. A merge creates a merge pennant and a release creates a release beacon. Activities are deduplicated by their durable action identity and only source events whose actor ID matches the configured developer are accepted.

Stars, forks, branch creation, comments, counts, and follower data have no effect. A closed pull request is a merge only when GitHub explicitly reports `merged` or `closed` with `merged: true`.
