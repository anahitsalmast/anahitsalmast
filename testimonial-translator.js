// Testimonial Form Dynamic Message Translation
// This script handles real-time translation of dynamic messages in testimonial forms

document.addEventListener('DOMContentLoaded', function() {
  
  // Function to translate an element (placeholder - implement your translation logic)
  function translateElement(element) {
    // Add your translation logic here
    // This could integrate with Google Translate API, i18n libraries, or custom translation maps
    console.log('Translating element:', element);
    
    // Example translation logic (replace with your actual implementation)
    const armenianTranslations = {
      'Success! Your testimonial has been submitted.': 'Հաջողություն: Ձեր գնահատականը հաստատվել է:',
      'Error: Please fill in all required fields.': 'Սխալ՝ խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը:',
      'Notice: Please review your submission.': 'Ծանուցում՝ խնդրում ենք վերանայել ձեր ներկայացումը:'
    };
    
    const originalText = element.textContent.trim();
    if (armenianTranslations[originalText]) {
      element.textContent = armenianTranslations[originalText];
    }
  }

  // Function to translate static content on page load
  function translateStaticContent() {
    const staticMessages = document.querySelectorAll(
      '.sp-testimonial-success-message, .sp-testimonial-error-message, .sp-testimonial-notice-message'
    );
    
    staticMessages.forEach(message => {
      translateElement(message);
    });
  }

  // Dynamic հաղորդագրությունների թարգմանությունը՝ ըստ փոփոխության
  function observeDynamicMessages() {
    const container = document.querySelector('#testimonial_form');

    if (!container) return;

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (
              node.classList.contains('sp-testimonial-success-message') ||
              node.classList.contains('sp-testimonial-error-message') ||
              node.classList.contains('sp-testimonial-notice-message')
            ) {
              translateElement(node);
            }
          }
        });
      });
    });

    observer.observe(container, { childList: true, subtree: true });
  }

  // Initialize translation functionality
  translateStaticContent();
  observeDynamicMessages();
});