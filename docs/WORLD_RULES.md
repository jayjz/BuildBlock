# World rules: p0-v1

The observation window is the `asOf` UTC day plus the six preceding UTC days, ending at `asOf`. Each supported activity on a day emits one `workday_observed` event; repeated work on that day does not create more frontage state.

`code_pushed`, `pull_request_opened`, `pull_request_merged`, and `release_published` create eligible observed work for that activity's repository. Repository groups are ordered by their latest eligible observation and repository ID, with a most-recent name resolved deterministically. A merge creates one repository-specific joined-work state and a release one repository-specific publication state; repeated events do not multiply either state. Activities are deduplicated by their durable action identity and only source events whose actor ID matches the configured developer are accepted.

Stars, forks, branch creation, comments, counts, and follower data have no effect. A closed pull request is a merge only when GitHub explicitly reports `merged` or `closed` with `merged: true`.
