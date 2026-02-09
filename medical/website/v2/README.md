# Global Medical Website v2

## Form submission logic (single source of truth)

The official form submission handler for v2 is:

- `medical/website/v2/js/main.js` (`initForms` + `handleFormSubmit`)

Operational rule:

- Add `data-ajax` to any form that should use the standard submission flow.
- Do not reintroduce a separate form-specific submission script for the same behavior.
