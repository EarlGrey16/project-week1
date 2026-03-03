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
        if (name === 'value') {
            if (!newValue) {
                this.selectedDate = null;
            } else {
                this.selectedDate = new Date(newValue + 'T00:00:00');
                this.viewDate = new Date(this.selectedDate);
            }
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
        
        // Check if in the past
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
                border: 1px solid var(--border-color, #ccc);
                border-radius: 8px;
                padding: 15px;
                background: var(--input-bg, #fff);
                color: var(--input-text, #333);
                user-select: none;
                margin-top: 5px;
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
                border: 1px solid var(--border-color, #ccc);
                color: var(--input-text, #333);
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .nav-btn:hover {
                background: var(--border-color, #eee);
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
                color: var(--secondary-color, #666);
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
                background: var(--border-color, #eee);
            }
            .day.disabled {
                color: var(--secondary-color, #999);
                opacity: 0.3;
                cursor: not-allowed;
                background: rgba(0,0,0,0.05);
            }
            .day.selected {
                background: var(--primary-color, #007bff);
                color: var(--button-text, #fff);
                font-weight: bold;
            }
            .day.today {
                border: 1px solid var(--primary-color, #007bff);
            }
            .day.weekend {
                background: rgba(0,0,0,0.03);
            }
            :host-context(body.dark-mode) .day.disabled {
                background: rgba(255,255,255,0.05);
            }
            :host-context(body.dark-mode) .day.weekend {
                background: rgba(255,255,255,0.03);
            }
        </style>
        <div class="calendar-header">
            <button type="button" class="nav-btn prev">&lt;</button>
            <h3>${monthName} ${year}</h3>
            <button type="button" class="nav-btn next">&gt;</button>
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

        this.shadowRoot.querySelector('.prev').onclick = (e) => { e.preventDefault(); this.prevMonth(); };
        this.shadowRoot.querySelector('.next').onclick = (e) => { e.preventDefault(); this.nextMonth(); };
        this.shadowRoot.querySelectorAll('.day:not(.disabled)').forEach(el => {
            el.onclick = () => this.selectDate(parseInt(el.textContent));
        });
    }

    generateDays(firstDay, daysInMonth, year, month, today) {
        let html = '';
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
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.checked = true;
        }

        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Phone Number Formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const input = e.target.value.replace(/\D/g, '').substring(0, 10);
            const areaCode = input.substring(0, 3);
            const middle = input.substring(3, 6);
            const last = input.substring(6, 10);

            if (input.length > 6) { e.target.value = `(${areaCode}) ${middle}-${last}`; }
            else if (input.length > 3) { e.target.value = `(${areaCode}) ${middle}`; }
            else if (input.length > 0) { e.target.value = `(${areaCode}`; }
        });
    }

    // Conditional Fields
    const deviceType = document.getElementById('device-type');
    const brandGroup = document.getElementById('brand-group');
    const brand = document.getElementById('brand');
    const seriesGroup = document.getElementById('series-group');
    const modelGroup = document.getElementById('model-group');
    const inquiryGroup = document.getElementById('inquiry-group');

    if (deviceType) {
        deviceType.addEventListener('change', () => {
            const isPhone = deviceType.value === 'phone';
            const isComputer = deviceType.value === 'computer';
            brandGroup.style.display = isPhone ? 'block' : 'none';
            inquiryGroup.style.display = isComputer ? 'block' : 'none';
            if (!isPhone) {
                seriesGroup.style.display = 'none';
                modelGroup.style.display = 'none';
            }
        });
    }

    if (brand) {
        brand.addEventListener('change', () => {
            const isApple = brand.value === 'apple';
            seriesGroup.style.display = isApple ? 'block' : 'none';
            modelGroup.style.display = isApple ? 'block' : 'none';
            inquiryGroup.style.display = (brand.value === 'other') ? 'block' : 'none';
        });
    }

    // Date and Time Logic
    const calendarPicker = document.getElementById('reservation-date-picker');
    const reservationDateInput = document.getElementById('reservation-date');
    const reservationTime = document.getElementById('reservation-time');

    if (calendarPicker) {
        calendarPicker.addEventListener('change', (e) => {
            const val = e.detail.value;
            reservationDateInput.value = val;
            updateAvailableTimeSlots(val);
        });
    }

    function updateAvailableTimeSlots(date) {
        reservationTime.innerHTML = '<option value="" disabled selected>Select Time</option>';
        
        // Final explicit list of time slots to prevent any loop logic confusion
        // Strictly stops at 5:00 PM (17:00)
        const slots = [
            '10:00', '10:30',
            '11:00', '11:30',
            '12:00', '12:30',
            '13:00', '13:30',
            '14:00', '14:30',
            '15:00', '15:30',
            '16:00', '16:30',
            '17:00'
        ];

        const allReservations = JSON.parse(localStorage.getItem('tech_reservations') || '[]');
        const bookedSlots = allReservations.filter(res => res.date === date).map(res => res.time);

        // Get current time in Pacific Time
        const now = new Date();
        const pacificNow = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        const currentYear = pacificNow.getFullYear();
        const currentMonth = String(pacificNow.getMonth() + 1).padStart(2, '0');
        const currentDate = String(pacificNow.getDate()).padStart(2, '0');
        const todayString = `${currentYear}-${currentMonth}-${currentDate}`;
        const currentHours = pacificNow.getHours();
        const currentMinutes = pacificNow.getMinutes();

        slots.forEach(slot => {
            const [hour, minute] = slot.split(':').map(Number);
            const option = document.createElement('option');
            const isBooked = bookedSlots.includes(slot);
            
            // Check if slot is in the past for today
            let isPast = false;
            if (date === todayString) {
                if (hour < currentHours || (hour === currentHours && minute <= currentMinutes)) {
                    isPast = true;
                }
            }

            option.value = slot;
            option.textContent = slot + (isBooked ? ' (Taken)' : '') + (isPast ? ' (Past)' : '');
            
            if (isBooked || isPast) {
                option.disabled = true;
                option.style.color = '#999';
            }
            reservationTime.appendChild(option);
        });
    }

    // Photo Attachment Logic
    const photoAttachment = document.getElementById('photo-attachment');
    const photoPreview = document.getElementById('photo-preview');
    const previewImg = document.getElementById('preview-img');
    const removePhotoBtn = document.getElementById('remove-photo');
    let attachedPhotoData = null;

    if (photoAttachment) {
        photoAttachment.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    attachedPhotoData = event.target.result;
                    previewImg.src = attachedPhotoData;
                    photoPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', () => {
            photoAttachment.value = '';
            attachedPhotoData = null;
            photoPreview.style.display = 'none';
            previewImg.src = '';
        });
    }

    // Form Submission
    if (reservationForm) {
        reservationForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const dateVal = reservationDateInput.value;
            const timeVal = reservationTime.value;

            if (!dateVal) {
                alert('Please select a date from the calendar.');
                return;
            }

            const formData = {
                name: reservationForm.name.value,
                email: reservationForm.email.value,
                phone: reservationForm.phone.value,
                deviceType: deviceType.value,
                brand: brand ? brand.value : '',
                series: reservationForm.series ? reservationForm.series.value : '',
                model: reservationForm.model ? reservationForm.model.value : '',
                date: dateVal,
                time: timeVal,
                problemDescription: reservationForm['problem-description'].value,
                photo: attachedPhotoData, // Including the Base64 photo string
            };

            const allReservations = JSON.parse(localStorage.getItem('tech_reservations') || '[]');
            allReservations.push({ date: dateVal, time: timeVal });
            localStorage.setItem('tech_reservations', JSON.stringify(allReservations));

            console.log('Reservation Data (with photo if provided):', formData);

            alert(`Your reservation for ${dateVal} at ${timeVal} has been successfully submitted!`);
            reservationForm.reset();
            
            // Reset additional UI elements
            attachedPhotoData = null;
            photoPreview.style.display = 'none';
            previewImg.src = '';
            
            calendarPicker.value = '';
            reservationDateInput.value = '';
            brandGroup.style.display = 'none';
            seriesGroup.style.display = 'none';
            modelGroup.style.display = 'none';
            inquiryGroup.style.display = 'none';
            reservationTime.innerHTML = '<option value="" disabled selected>Select a date first</option>';
        });
    }
});
