# Website changes and regression coverage

- For each new or changed visitor interaction, add or extend the browser test for that journey in `tests/browser/`. For a bug fix, include a regression that fails with the old behaviour where practical.
- Keep the automatic all-page navigation, local-link, mobile-layout and no-JavaScript checks applicable to new public pages. Test new controls and states explicitly; automatic page discovery alone does not cover their behaviour.
- Run the checks in `TESTING.md` before publishing. Browser tests and privacy/security checks must pass before deployment. Never skip, weaken or remove a failing assertion to obtain a passing build without resolving or explaining its cause.
- For changes involving touch, focus, menus or mobile layouts, also test in iOS Safari using the Xcode simulator when available. Record the tested device, OS, actions and outcome; distinguish simulator checks from browser emulation.
- When changing `navigation.js`, bump its numeric `v` query value consistently on every page so visitors with a cached script receive the update.
- Tests must use fictional data and intercept external submissions. Never send automated test forms to Formspree or the council, or add private intake data to fixtures, screenshots or reports.
- Keep test dependencies and test artifacts out of `PUBLIC_FILES`. Add intended repository maintenance files explicitly to `MAINTENANCE_FILES`; stage named files and inspect the staged diff.
