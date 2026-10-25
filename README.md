# NextOffer — Prachi's Evaluation Updates

Updated the personalized dashboard to cover the requested React evaluation concepts:
- Daily learning goal with configurable target, progress percentage, and in-app reminder.
- Weekly activity chart and coding streak.
- Recently resumed questions and a shortcut to the learning roadmap.
- Persistent daily-goal progress stored in localStorage.
- Existing global light/dark theme is managed with React Context API and persisted across pages.
- Existing login/signup flow, reusable validation inputs, and multi-page routing remain in place.

## Run locally

1. Extract this ZIP.
2. Open the `my-next-offer` folder in VS Code.
3. Open Terminal in that folder and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL printed by Vite (usually `http://localhost:5173`).

The ZIP intentionally excludes `node_modules`; run `npm install` on your computer so dependencies match your operating system.


## Code execution

The Practice workspace can run JavaScript, Python, and Java using the remote Piston execution API (`https://emkc.org/api/v2/piston/execute`). Use **Run code** to view output or **Run & submit** to execute and save the code, language, input, output, exit code, and timestamp in the signed-in user's local submission history. This requires an internet connection and availability of the external execution service. The service may rate-limit requests. Do not submit passwords, API keys, personal data, or other secrets.

The application displays the output and execution/compilation errors, but it does not automatically grade a challenge against hidden test cases. Successful execution means the program ran with exit code 0, not necessarily that the algorithm is correct.
