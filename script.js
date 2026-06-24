// script.js
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            alert('Mobile menu feature coming soon! Please use desktop view for now.');
        });
    }

    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your interest! Since this is a static demo, your inquiry has not been sent. Please integrate Tally or Google Forms to receive submissions.');
            inquiryForm.reset();
        });
    }
});
