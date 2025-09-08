export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

export function setLoadingState(element, isLoading) {
    if (!element) return;
    
    if (isLoading) {
        element.disabled = true;
        const originalText = element.textContent;
        element.dataset.originalText = originalText;
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    } else {
        element.disabled = false;
        element.textContent = element.dataset.originalText || '';
    }
}

export function setupModal(modalId, openButtonId, options = {}) {
    const modal = document.getElementById(modalId);
    const openBtn = document.getElementById(openButtonId);
    const closeBtn = document.getElementById(options.closeButtonId || 'cancel' + openButtonId);
    const form = document.getElementById(options.formId || modalId + 'Form');

    if (!modal || !openBtn) return;

    const openModal = () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (options.onOpen) options.onOpen();
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        if (form) form.reset();
        if (options.onClose) options.onClose();
    };

    openBtn.addEventListener('click', openModal);
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    if (form && options.onSubmit) {
        form.addEventListener('submit', options.onSubmit);
    }

    return { openModal, closeModal };
}