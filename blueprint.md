
# Tech Repair Reservations Website

## Overview

A simple, one-page website for users to book appointments for phone or computer repairs.

## Current Features

*   **Reservation Form:** A form to collect user information, device type, and problem description.
*   **Dark Mode Toggle:** A button to switch between light and dark themes, with preference saved in local storage.
*   **Dynamic Phone Selection:** Conditional sub-menus for brand, series, and model when "Phone" is selected.

## Design and Style

*   **Layout:** Centered content within a rounded container.
*   **Colors:** Responsive color variables for light and dark modes.
*   **Typography:** Clean, system-standard sans-serif fonts.
*   **Interactivity:** Hover effects on buttons and form inputs; smooth theme transitions.

## Plan for Current Request

1.  **Modify `main.js`:**
    *   Use standard `<input type="date">` for date selection.
    *   Implement validation logic to prevent weekend selections (Saturday and Sunday) via alerts and resetting the input.
    *   Restrict the `min` attribute to the current date to prevent past bookings.
    *   Cap the last available reservation slot at 5:00 PM (17:00).
2.  **Modify `index.html`:**
    *   Ensure the standard date input is used.
3.  **Verification:**
    *   Ensure weekends cannot be selected.
    *   Verify that selecting a weekday updates the available time slots up to 5 PM.
