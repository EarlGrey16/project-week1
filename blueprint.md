# Tech Repair Reservations Website

## Overview

A simple, one-page website for users to book appointments for phone or computer repairs.

## Current Features

*   **Reservation Form:** A form to collect user information, device type, and problem description.
*   **Dark Mode Toggle:** A button to switch between light and dark themes, with preference saved in local storage.

## Design and Style

*   **Layout:** Centered content within a rounded container.
*   **Colors:** Responsive color variables for light and dark modes.
*   **Typography:** Clean, system-standard sans-serif fonts.
*   **Interactivity:** Hover effects on buttons and form inputs; smooth theme transitions.

## Plan for Current Request

1.  **Modify `index.html`:** Change the theme toggle from a button to a switch-like structure (label, checkbox, and slider).
2.  **Modify `style.css`:**
    *   Position the theme toggle container in the top-right corner of the main container, ensuring it doesn't overlap with the header text.
    *   Style the theme toggle as a sliding switch (left for light, right for dark).
    *   Add icons or visual cues to the switch.
3.  **Modify `main.js`:**
    *   Update the theme toggle logic to work with a checkbox input.
    *   Ensure the switch state (checked/unchecked) correctly reflects the active theme on page load.
