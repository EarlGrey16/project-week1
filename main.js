document.addEventListener('DOMContentLoaded', () => {
    const reservationForm = document.getElementById('reservation-form');

    if (reservationForm) {
        reservationForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = {
                name: reservationForm.name.value,
                email: reservationForm.email.value,
                phone: reservationForm.phone.value,
                deviceType: reservationForm['device-type'].value,
                problemDescription: reservationForm['problem-description'].value,
            };

            console.log('Reservation Data:', formData);

            alert('Your reservation has been successfully submitted! We will contact you shortly.');
            
            reservationForm.reset();
        });
    }
});
