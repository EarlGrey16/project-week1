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

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    reservationDate.setAttribute('min', today);

    // Weekday only check
    reservationDate.addEventListener('input', (e) => {
        const day = new Date(e.target.value).getUTCDay();
        if ([0, 6].includes(day)) { // 0 is Sunday, 6 is Saturday
            alert('Reservations are only available on weekdays (Monday to Friday).');
            e.target.value = '';
            reservationTime.innerHTML = '<option value="" disabled selected>Select a date first</option>';
        } else {
            updateAvailableTimeSlots(e.target.value);
        }
    });

    function updateAvailableTimeSlots(date) {
        reservationTime.innerHTML = '<option value="" disabled selected>Select Time</option>';
        
        // Generate slots from 10:00 to 18:00 in 30min intervals
        const slots = [];
        for (let hour = 10; hour < 18; hour++) {
            slots.push(`${hour}:00`);
            slots.push(`${hour}:30`);
        }
        slots.push('18:00');

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

            const dateVal = reservationForm['reservation-date'].value;
            const timeVal = reservationForm['reservation-time'].value;

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
