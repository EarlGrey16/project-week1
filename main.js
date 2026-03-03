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

    // Date and Time Logic
    const reservationDate = document.getElementById('reservation-date');
    const reservationTime = document.getElementById('reservation-time');

    if (reservationDate) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        reservationDate.setAttribute('min', today);

        reservationDate.addEventListener('input', (e) => {
            const dateVal = e.target.value;
            if (!dateVal) return;

            const date = new Date(dateVal);
            const day = date.getUTCDay();

            // Check if weekend (0 is Sunday, 6 is Saturday)
            if (day === 0 || day === 6) {
                alert('Reservations are only available on weekdays (Monday to Friday).');
                e.target.value = '';
                reservationTime.innerHTML = '<option value="" disabled selected>Select a date first</option>';
            } else {
                updateAvailableTimeSlots(dateVal);
            }
        });
    }

    function updateAvailableTimeSlots(date) {
        reservationTime.innerHTML = '<option value="" disabled selected>Select Time</option>';
        
        // Generate slots from 10:00 to 17:00 in 30min intervals
        // Last slot will be 17:00 (5:00 PM)
        const slots = [];
        for (let hour = 10; hour < 17; hour++) {
            slots.push(`${hour}:00`);
            slots.push(`${hour}:30`);
        }
        slots.push('17:00');

        // Get booked slots for this date from localStorage
        const allReservations = JSON.parse(localStorage.getItem('tech_reservations') || '[]');
        const bookedSlots = allReservations
            .filter(res => res.date === date)
            .map(res => res.time);

        slots.forEach(slot => {
            const option = document.createElement('option');
            const isBooked = bookedSlots.includes(slot);
            
            option.value = slot;
            option.textContent = slot + (isBooked ? ' (Taken)' : '');
            if (isBooked) {
                option.disabled = true;
                option.style.color = '#999';
            }
            reservationTime.appendChild(option);
        });
    }

    // Form Submission Logic
    if (reservationForm) {
        reservationForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const dateVal = reservationDate.value;
            const timeVal = reservationForm['reservation-time'].value;

            if (!dateVal) {
                alert('Please select a preferred date.');
                return;
            }

            const formData = {
                name: reservationForm.name.value,
                email: reservationForm.email.value,
                phone: reservationForm.phone.value,
                deviceType: reservationForm['device-type'].value,
                brand: reservationForm.brand ? reservationForm.brand.value : '',
                series: reservationForm.series ? reservationForm.series.value : '',
                model: reservationForm.model ? reservationForm.model.value : '',
                date: dateVal,
                time: timeVal,
                problemDescription: reservationForm['problem-description'].value,
            };

            // Save to localStorage to "take" the slot
            const allReservations = JSON.parse(localStorage.getItem('tech_reservations') || '[]');
            allReservations.push({ date: dateVal, time: timeVal });
            localStorage.setItem('tech_reservations', JSON.stringify(allReservations));

            console.log('Reservation Data:', formData);

            alert(`Your reservation for ${dateVal} at ${timeVal} has been successfully submitted!`);
            
            reservationForm.reset();
            // Reset visibility and time slots
            if (brandGroup) brandGroup.style.display = 'none';
            if (seriesGroup) seriesGroup.style.display = 'none';
            if (modelGroup) modelGroup.style.display = 'none';
            if (inquiryGroup) inquiryGroup.style.display = 'none';
            reservationTime.innerHTML = '<option value="" disabled selected>Select a date first</option>';
        });
    }
});
