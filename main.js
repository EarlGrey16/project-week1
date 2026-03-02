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
            themeToggle.checked = true;
        }

        themeToggle.addEventListener('change', () => {
            const isDarkMode = themeToggle.checked;
            if (isDarkMode) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Conditional Fields Logic
    const deviceType = document.getElementById('device-type');
    const brandGroup = document.getElementById('brand-group');
    const brand = document.getElementById('brand');
    const seriesGroup = document.getElementById('series-group');
    const modelGroup = document.getElementById('model-group');
    const inquiryGroup = document.getElementById('inquiry-group');

    deviceType.addEventListener('change', () => {
        if (deviceType.value === 'phone') {
            brandGroup.style.display = 'block';
            inquiryGroup.style.display = 'none';
        } else {
            brandGroup.style.display = 'none';
            seriesGroup.style.display = 'none';
            modelGroup.style.display = 'none';
            inquiryGroup.style.display = (deviceType.value === 'computer' ? 'block' : 'none');
        }
    });

    brand.addEventListener('change', () => {
        if (brand.value === 'apple') {
            seriesGroup.style.display = 'block';
            modelGroup.style.display = 'block';
            inquiryGroup.style.display = 'none';
        } else if (brand.value === 'other') {
            seriesGroup.style.display = 'none';
            modelGroup.style.display = 'none';
            inquiryGroup.style.display = 'block';
        }
    });

    // Form Submission Logic
    if (reservationForm) {
        reservationForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = {
                name: reservationForm.name.value,
                email: reservationForm.email.value,
                phone: reservationForm.phone.value,
                deviceType: reservationForm['device-type'].value,
                brand: reservationForm.brand.value,
                series: reservationForm.series.value,
                model: reservationForm.model.value,
                reservationDate: reservationForm['reservation-date'].value,
                problemDescription: reservationForm['problem-description'].value,
            };

            console.log('Reservation Data:', formData);

            alert('Your reservation has been successfully submitted! We will contact you shortly.');
            
            reservationForm.reset();
            // Reset visibility
            brandGroup.style.display = 'none';
            seriesGroup.style.display = 'none';
            modelGroup.style.display = 'none';
            inquiryGroup.style.display = 'none';
        });
    }
});
