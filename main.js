class CustomCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.viewDate = new Date();
        this.selectedDate = null;
        this.minDate = new Date();
        this.minDate.setHours(0, 0, 0, 0);
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value' && newValue) {
            this.selectedDate = new Date(newValue + 'T00:00:00');
            this.viewDate = new Date(this.selectedDate);
            this.render();
        }
    }

    get value() {
        return this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : '';
    }

    set value(val) {
        if (!val) {
            this.selectedDate = null;
        } else {
            this.selectedDate = new Date(val + 'T00:00:00');
            this.viewDate = new Date(this.selectedDate);
        }
        this.render();
    }

    prevMonth() {
        this.viewDate.setMonth(this.viewDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.viewDate.setMonth(this.viewDate.getMonth() + 1);
        this.render();
    }

    selectDate(day) {
        const date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
        const dayOfWeek = date.getDay();
        
        // Check if weekend (0=Sunday, 6=Saturday)
        if (dayOfWeek === 0 || dayOfWeek === 6) return;
        
        // Check if in the past (before today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return;

        this.selectedDate = date;
        this.render();
        
        this.dispatchEvent(new CustomEvent('change', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(this.viewDate);
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                font-family: inherit;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 15px;
                background: var(--input-bg);
                color: var(--input-text);
                user-select: none;
            }
            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            .calendar-header h3 {
                margin: 0;
                font-size: 1.1em;
            }
            .nav-btn {
                background: none;
                border: 1px solid var(--border-color);
                color: var(--input-text);
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .nav-btn:hover {
                background: var(--border-color);
            }
            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 5px;
            }
            .day-label {
                text-align: center;
                font-weight: bold;
                font-size: 0.8em;
                color: var(--secondary-color);
                padding-bottom: 5px;
            }
            .day {
                aspect-ratio: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border-radius: 4px;
                font-size: 0.9em;
                transition: background 0.2s, color 0.2s;
            }
            .day:hover:not(.disabled):not(.selected) {
                background: var(--border-color);
            }
            .day.disabled {
                color: var(--secondary-color);
                opacity: 0.3;
                cursor: not-allowed;
                background: rgba(0,0,0,0.05);
            }
            :host-context(body.dark-mode) .day.disabled {
                background: rgba(255,255,255,0.05);
            }
            .day.selected {
                background: var(--primary-color);
                color: var(--button-text);
                font-weight: bold;
            }
            .day.today {
                border: 1px solid var(--primary-color);
            }
            .day.weekend {
                background: rgba(0,0,0,0.03);
            }
            :host-context(body.dark-mode) .day.weekend {
                background: rgba(255,255,255,0.03);
            }
        </style>
        <div class="calendar-header">
            <button class="nav-btn prev">&lt;</button>
            <h3>${monthName} ${year}</h3>
            <button class="nav-btn next">&gt;</button>
        </div>
        <div class="calendar-grid">
            <div class="day-label">Su</div>
            <div class="day-label">Mo</div>
            <div class="day-label">Tu</div>
            <div class="day-label">We</div>
            <div class="day-label">Th</div>
            <div class="day-label">Fr</div>
            <div class="day-label">Sa</div>
            ${this.generateDays(firstDay, daysInMonth, year, month, today)}
        </div>
        `;

        this.shadowRoot.querySelector('.prev').onclick = () => this.prevMonth();
        this.shadowRoot.querySelector('.next').onclick = () => this.nextMonth();
        this.shadowRoot.querySelectorAll('.day:not(.disabled)').forEach(el => {
            el.onclick = () => this.selectDate(parseInt(el.textContent));
        });
    }

    generateDays(firstDay, daysInMonth, year, month, today) {
        let html = '';
        // Empty slots before first day
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="empty"></div>';
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dayOfWeek = date.getDay();
            const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
            const isPast = date < today;
            const isToday = date.getTime() === today.getTime();
            const isSelected = this.selectedDate && date.getTime() === this.selectedDate.getTime();
            
            const classes = ['day'];
            if (isWeekend || isPast) classes.push('disabled');
            if (isWeekend) classes.push('weekend');
            if (isToday) classes.push('today');
            if (isSelected) classes.push('selected');
            
            html += `<div class="${classes.join(' ')}">${i}</div>`;
        }
        return html;
    }
}
customElements.define('custom-calendar', CustomCalendar);

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
    const calendarPicker = document.getElementById('reservation-date-picker');
    const reservationDateInput = document.getElementById('reservation-date');
    const reservationTime = document.getElementById('reservation-time');

    if (calendarPicker) {
        calendarPicker.addEventListener('change', (e) => {
            const dateValue = e.detail.value;
            reservationDateInput.value = dateValue;
            updateAvailableTimeSlots(dateValue);
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

            const dateVal = reservationDateInput.value;
            const timeVal = reservationForm['reservation-time'].value;

            if (!dateVal) {
                alert('Please select a date from the calendar.');
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
            // Reset custom calendar
            calendarPicker.value = '';
            // Reset visibility and time slots
            if (brandGroup) brandGroup.style.display = 'none';
            if (seriesGroup) seriesGroup.style.display = 'none';
            if (modelGroup) modelGroup.style.display = 'none';
            if (inquiryGroup) inquiryGroup.style.display = 'none';
            reservationTime.innerHTML = '<option value="" disabled selected>Select a date first</option>';
        });
    }
});

