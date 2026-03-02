document.addEventListener('DOMContentLoaded', () => {
    const reservationForm = document.getElementById('reservation-form');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Theme Toggle Logic
    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            updateToggleUI(true);
        }

        themeToggle.addEventListener('click', () => {
            const isDarkMode = body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            updateToggleUI(isDarkMode);
        });
    }

    function updateToggleUI(isDarkMode) {
        const icon = themeToggle.querySelector('.icon');
        const text = themeToggle.querySelector('.text');
        if (isDarkMode) {
            icon.textContent = '☀️';
            text.textContent = 'Light Mode';
        } else {
            icon.textContent = '🌙';
            text.textContent = 'Dark Mode';
        }
    }

    // Form Submission Logic
    if (reservationForm) {
        reservationForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = {
                name: reservationForm.name.value,
                email: reservationForm.email.value,
                phone: reservationForm.phone.value,
                deviceType: reservationForm['device-type'].value,
                reservationDate: reservationForm['reservation-date'].value,
                problemDescription: reservationForm['problem-description'].value,
            };

            console.log('Reservation Data:', formData);

            alert('Your reservation has been successfully submitted! We will contact you shortly.');
            
            reservationForm.reset();
        });
    }
});
