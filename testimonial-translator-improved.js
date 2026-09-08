/**
 * Enhanced Testimonial Form Translation System
 * Supports multi-language translation with improved performance and error handling
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Configuration object for better maintainability
  const CONFIG = {
    defaultLang: 'ru',
    supportedLangs: ['ru', 'hy', 'en'],
    selectors: {
      form: '#testimonial_form',
      labels: '.sp-testimonial-label-section label',
      afterText: '.tpro_client_after',
      submitBtn: '#testimonial_form input[type="submit"]',
      requiredMsg: '.sp-testimonial-required-message',
      messages: {
        success: '.sp-testimonial-success-message',
        error: '.sp-testimonial-error-message',
        notice: '.sp-testimonial-notice-message'
      }
    },
    observer: {
      childList: true,
      subtree: true,
      characterData: true
    }
  };

  // Enhanced language detection with fallback
  function detectLanguage() {
    const path = window.location.pathname;
    
    // Check URL path patterns
    if (path.startsWith('/hy/')) return 'hy';
    if (path.startsWith('/en/')) return 'en';
    
    // Check HTML lang attribute as fallback
    const htmlLang = document.documentElement.lang;
    if (htmlLang && CONFIG.supportedLangs.includes(htmlLang.toLowerCase())) {
      return htmlLang.toLowerCase();
    }
    
    // Check browser language as secondary fallback
    const browserLang = navigator.language.split('-')[0];
    if (CONFIG.supportedLangs.includes(browserLang)) {
      return browserLang;
    }
    
    return CONFIG.defaultLang;
  }

  const currentLang = detectLanguage();

  // Enhanced translations object with better organization
  const translations = {
    hy: {
      // Form labels
      'Полное имя': 'Անուն Ազգանուն',
      'Электронная почта': 'Էլ․ հասցե',
      'Город / Страна': 'Քաղաք / Երկիր',
      'Отзыв': 'Կարծիք',
      
      // Placeholders
      'Ваше полное имя': 'Ձեր ամբողջական անունը',
      'Ваш электронный адрес': 'Ձեր էլ․ հասցեն',
      'Откуда вы?': 'Որտեղի՞ց եք դուք',
      'Что вы о нас думаете?': 'Ի՞նչ կարծիք ունեք մեր մասին',
      
      // Actions
      'Отправить отзыв': 'Ուղարկել կարծիքը',
      
      // Messages
      'Поля, отмеченные *, обязательны для заполнения.': 'Կարմիր աստղանիշով դաշտերը պարտադիր են։',
      'Поля, отмеченные красной звездочкой, обязательны для заполнения.': 'Կարմիր աստղանիշով դաշտերը պարտադիր են։',
      'Спасибо! Ваш отзыв ожидает одобрения.': 'Շնորհակալություն։ Ձեր կարծիքը ներկայումս սպասում է հաստատման։',
      'При обработке вашего отзыва возникла проблема.': 'Ցավոք Ձեր կարծիքը մշակելիս խնդիր է առաջացել։'
    },
    en: {
      // Form labels
      'Полное имя': 'Full Name',
      'Электронная почта': 'E-mail Address',
      'Город / Страна': 'Location',
      'Отзыв': 'Testimonial Content',
      
      // Placeholders
      'Ваше полное имя': 'What is your full name?',
      'Ваш электронный адрес': 'What is your e-mail address?',
      'Откуда вы?': 'Where are you from?',
      'Что вы о нас думаете?': 'What do you think about us?',
      
      // Actions
      'Отправить отзыв': 'Submit Testimonial',
      
      // Messages
      'Поля, отмеченные *, обязательны для заполнения.': 'Red asterisk fields are required.',
      'Поля, отмеченные красной звездочкой, обязательны для заполнения.': 'Red asterisk fields are required.',
      'Спасибо! Ваш отзыв ожидает одобрения.': 'Thank you! Your testimonial is currently waiting to be approved.',
      'При обработке вашего отзыва возникла проблема.': 'We encountered an issue while processing your testimonial.'
    }
  };

  // Get translations for current language
  const t = translations[currentLang];
  
  // Exit early if no translations available or using default language
  if (!t || currentLang === CONFIG.defaultLang) {
    console.log(`Testimonial Translator: Using default language (${CONFIG.defaultLang})`);
    return;
  }

  // Cache for already translated elements to prevent re-translation
  const translatedElements = new WeakSet();

  /**
   * Enhanced translation function with better text matching
   * @param {Element} element - The DOM element to translate
   * @param {boolean} force - Force translation even if already translated
   */
  function translateElement(element, force = false) {
    if (!element || !element.textContent) return;
    
    // Skip if already translated (unless forced)
    if (!force && translatedElements.has(element)) return;
    
    const originalText = element.textContent.trim();
    
    // Skip empty text
    if (!originalText) return;
    
    // Direct translation match
    if (t[originalText]) {
      element.textContent = t[originalText];
      translatedElements.add(element);
      return;
    }
    
    // Fuzzy matching for partial text (useful for dynamic content)
    for (const [russian, translation] of Object.entries(t)) {
      if (originalText.includes(russian)) {
        element.textContent = originalText.replace(russian, translation);
        translatedElements.add(element);
        return;
      }
    }
  }

  /**
   * Translate form input attributes (placeholders, values, etc.)
   */
  function translateFormAttributes() {
    try {
      // Translate input placeholders
      document.querySelectorAll('#testimonial_form input[placeholder], #testimonial_form textarea[placeholder]').forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder && t[placeholder]) {
          input.setAttribute('placeholder', t[placeholder]);
        }
      });
      
      // Translate select option text
      document.querySelectorAll('#testimonial_form select option').forEach(option => {
        translateElement(option);
      });
      
    } catch (error) {
      console.warn('Testimonial Translator: Error translating form attributes:', error);
    }
  }

  /**
   * Enhanced static content translation with error handling
   */
  function translateStaticContent() {
    try {
      // Translate labels
      document.querySelectorAll(CONFIG.selectors.labels).forEach(translateElement);
      
      // Translate after-text elements
      document.querySelectorAll(CONFIG.selectors.afterText).forEach(translateElement);
      
      // Translate submit button
      const submitBtn = document.querySelector(CONFIG.selectors.submitBtn);
      if (submitBtn) {
        if (submitBtn.value && t[submitBtn.value]) {
          submitBtn.value = t[submitBtn.value];
        }
        // Also check button text content
        translateElement(submitBtn);
      }
      
      // Translate required message
      const requiredMsg = document.querySelector(CONFIG.selectors.requiredMsg);
      if (requiredMsg) {
        translateElement(requiredMsg);
      }
      
      // Translate form attributes
      translateFormAttributes();
      
      console.log(`Testimonial Translator: Static content translated to ${currentLang}`);
      
    } catch (error) {
      console.error('Testimonial Translator: Error in static translation:', error);
    }
  }

  /**
   * Enhanced dynamic message observer with debouncing
   */
  function observeDynamicMessages() {
    const container = document.querySelector(CONFIG.selectors.form);
    
    if (!container) {
      console.warn('Testimonial Translator: Form container not found');
      return;
    }
    
    let debounceTimer;
    
    const observer = new MutationObserver(mutations => {
      // Debounce rapid mutations
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        
        mutations.forEach(mutation => {
          // Handle added nodes
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the node itself is a message
              if (isMessageElement(node)) {
                translateElement(node);
              }
              
              // Check child elements for messages
              const messageElements = node.querySelectorAll(getMessageSelectors());
              messageElements.forEach(translateElement);
            }
          });
          
          // Handle text changes in existing nodes
          if (mutation.type === 'characterData' && mutation.target.parentElement) {
            const parentElement = mutation.target.parentElement;
            if (isMessageElement(parentElement)) {
              translateElement(parentElement, true); // Force re-translation
            }
          }
        });
        
      }, 100); // 100ms debounce
    });
    
    observer.observe(container, CONFIG.observer);
    
    console.log('Testimonial Translator: Dynamic message observer initialized');
    
    // Return observer for potential cleanup
    return observer;
  }

  /**
   * Check if element is a testimonial message
   * @param {Element} element
   * @returns {boolean}
   */
  function isMessageElement(element) {
    return element.classList && (
      element.classList.contains('sp-testimonial-success-message') ||
      element.classList.contains('sp-testimonial-error-message') ||
      element.classList.contains('sp-testimonial-notice-message')
    );
  }

  /**
   * Get combined message selectors
   * @returns {string}
   */
  function getMessageSelectors() {
    return Object.values(CONFIG.selectors.messages).join(', ');
  }

  /**
   * Initialize translation system with retry mechanism
   */
  function initializeTranslation() {
    let attempts = 0;
    const maxAttempts = 3;
    
    function attemptTranslation() {
      attempts++;
      
      try {
        translateStaticContent();
        const observer = observeDynamicMessages();
        
        // Store observer for potential cleanup
        window.testimonialTranslatorObserver = observer;
        
        console.log(`Testimonial Translator: Successfully initialized (attempt ${attempts})`);
        
      } catch (error) {
        console.error(`Testimonial Translator: Initialization failed (attempt ${attempts}):`, error);
        
        if (attempts < maxAttempts) {
          setTimeout(attemptTranslation, 1000 * attempts); // Exponential backoff
        } else {
          console.error('Testimonial Translator: Max initialization attempts reached');
        }
      }
    }
    
    attemptTranslation();
  }

  /**
   * Cleanup function for when translation is no longer needed
   */
  function cleanup() {
    if (window.testimonialTranslatorObserver) {
      window.testimonialTranslatorObserver.disconnect();
      delete window.testimonialTranslatorObserver;
      console.log('Testimonial Translator: Observer cleaned up');
    }
  }

  // Expose cleanup function globally
  window.testimonialTranslatorCleanup = cleanup;

  // Initialize the translation system
  initializeTranslation();

  // Optional: Re-translate when language might change (for SPA applications)
  window.addEventListener('popstate', () => {
    setTimeout(() => {
      const newLang = detectLanguage();
      if (newLang !== currentLang) {
        console.log(`Testimonial Translator: Language changed to ${newLang}, reinitializing...`);
        cleanup();
        // Re-run the entire script logic would need to be refactored for this
      }
    }, 100);
  });
});