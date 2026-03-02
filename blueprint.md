
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

1.  **Modify `index.html`:** Add hidden form groups for Brand, Series, and Model, and an inquiry message.
2.  **Modify `style.css`:** Add styling for the inquiry message and ensure hidden elements are properly handled.
3.  **Modify `main.js`:**
    *   Implement event listeners to show/hide the Brand selection when "Phone" is chosen.
    *   Implement logic to show Series and Model selection if "Apple" is chosen.
    *   Show an "Inquiry" message if "Other" is selected.
    *   Ensure the form resets properly.
4.  **Version Control:** Push and Deploy.
