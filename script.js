// script.js - Updated for Premium Version
document.addEventListener('DOMContentLoaded', () => {
    // Choice selection logic for Custom Builder
    const choiceItems = document.querySelectorAll('.choice-item');
    choiceItems.forEach(item => {
        item.addEventListener('click', function() {
            // Find sibling items in the same grid and remove active class
            const parentGrid = this.parentElement;
            parentGrid.querySelectorAll('.choice-item').forEach(sibling => {
                sibling.classList.remove('active');
            });
            // Add active class to clicked item
            this.classList.add('active');
        });
    });

    // Submit Order Logic
    const submitBtn = document.getElementById('submitOrder');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            alert('Your custom design has been captured! In a real store, this would lead to checkout or an inquiry form. For now, this is a visual demonstration.');
        });
    }

    // Header transparency on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});
