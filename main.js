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

    // Phone Number Formatting Logic
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const input = e.target.value.replace(/\D/g, '').substring(0, 10); // Only digits, max 10
            const areaCode = input.substring(0, 3);
            const middle = input.substring(3, 6);
            const last = input.substring(6, 10);

            if (input.length > 6) {
                e.target.value = `(${areaCode}) ${middle}-${last}`;
            } else if (input.length > 3) {
                e.target.value = `(${areaCode}) ${middle}`;
            } else if (input.length > 0) {
                e.target.value = `(${areaCode}`;
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

    if (deviceType) {
        deviceType.addEventListener('change', () => {
            console.log('Device selection changed to:', deviceType.value);
            if (deviceType.value === 'phone') {
                brandGroup.style.display = 'block';
                inquiryGroup.style.display = 'none';
            } else if (deviceType.value === 'computer') {
                brandGroup.style.display = 'none';
                seriesGroup.style.display = 'none';
                modelGroup.style.display = 'none';
                inquiryGroup.style.display = 'block';
            } else {
                brandGroup.style.display = 'none';
                seriesGroup.style.display = 'none';
                modelGroup.style.display = 'none';
                inquiryGroup.style.display = 'none';
            }
        });
    }

    if (brand) {
        brand.addEventListener('change', () => {
            console.log('Brand selection changed to:', brand.value);
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
                brand: reservationForm.brand ? reservationForm.brand.value : '',
                series: reservationForm.series ? reservationForm.series.value : '',
                model: reservationForm.model ? reservationForm.model.value : '',
                reservationDate: reservationForm['reservation-date'].value,
                problemDescription: reservationForm['problem-description'].value,
            };

            console.log('Reservation Data:', formData);

            alert('Your reservation has been successfully submitted! We will contact you shortly.');
            
            reservationForm.reset();
            // Reset visibility
            if (brandGroup) brandGroup.style.display = 'none';
            if (seriesGroup) seriesGroup.style.display = 'none';
            if (modelGroup) modelGroup.style.display = 'none';
            if (inquiryGroup) inquiryGroup.style.display = 'none';
        });
    }
});
