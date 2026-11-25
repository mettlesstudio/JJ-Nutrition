# Automatic Browser Testing
- Whenever I ask you to verify, test, inspect, or check a web app, UI, localhost server, or URL, NEVER use `curl`, `fetch`, or headless terminal scripts.
- Always automatically delegate browser testing to the built-in `browser` subagent (`invoke_subagent` with `browser`) to open Chrome, click through the flows, inspect console/network logs, and visually verify the UI.
