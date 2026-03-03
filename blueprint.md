
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
    *   Create a custom Web Component for the calendar (`<custom-calendar>`).
    *   Implement logic within the component to render a monthly calendar view.
    *   Disable (make unclickable and visually distinct) Saturday and Sunday dates.
    *   Integrate the custom calendar with the existing reservation form.
2.  **Modify `style.css`:**
    *   Add styling for the custom calendar component, including styles for disabled dates, selected dates, and navigation.
3.  **Modify `index.html`:**
    *   Replace the standard `<input type="date">` with the new `<custom-calendar>` component.
4.  **Verification:**
    *   Ensure weekends cannot be selected.
    *   Verify that selecting a weekday still updates the available time slots.
