import { Toast } from 'bootstrap';

const baseEl = `<div class="bs-toast toast toast-placement-ex m-2" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <span class="toast-icon">
                            <i class="bx bx-bell me-2"></i>
                        </span>
                        <div class="me-auto fw-semibold toast-title">Bootstrap</div>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body toast-message">Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.</div>
                </div>`;

// document.body.innerHTML += baseEl;
const contentToast = document.querySelector(".content-toast");
if (contentToast) {
    contentToast.innerHTML += baseEl;
}

// placement position
const TopLeft = "top-0 start-0";
const TopCenter = "top-0 start-50 translate-middle-x";
const TopRight = "top-0 end-0";
const MiddleLeft = "top-50 start-0 translate-middle-y";
const MiddleCenter = "top-50 start-50 translate-middle";
const MiddleRight = "top-50 end-0 translate-middle-y";
const BottomLeft = "bottom-0 start-0";
const BottomCenter = "bottom-0 start-50 translate-middle-x";
const BottomRight = "bottom-0 end-0";

const toastPlacementExample = document.querySelector(".toast-placement-ex");
const toastPlacementBtn = document.querySelector("#showToastPlacement");
const toastTitle = document.querySelector(".toast-title");
const toastMessage = document.querySelector(".toast-message");
const toastIcon = document.querySelector(".toast-icon");
let selectedType, selectedPlacement, toastPlacement;

// Dispose toast when open another
function toastDispose(toast) {
    if (toast && toast._element !== null) {
        if (toastPlacementExample) {
            toastPlacementExample.classList.remove(selectedType);
            DOMTokenList.prototype.remove.apply(
                toastPlacementExample.classList,
                selectedPlacement
            );
        }
        toast.dispose();
    }
}

function bootstrapToast(selectedType: string, title?: string, message?: string, icon?: string, position?: string) {
    if (toastPlacement) {
        toastDispose(toastPlacement);
    }

    selectedPlacement = position ? position.split(" ") : TopCenter.split(" ");

    
    if (toastPlacementExample) {
        toastPlacementExample.classList.add(selectedType);
        DOMTokenList.prototype.add.apply(
            toastPlacementExample.classList,
            selectedPlacement
        );
    }

    if (toastTitle && toastMessage) {
        toastTitle.textContent = title ?? null;
        toastMessage.textContent = message ?? null;
    }
    if (icon && toastIcon) toastIcon.innerHTML = icon;

    toastPlacement = new Toast(toastPlacementExample, {
        autohide: true,
        delay: 3000,
    });
    toastPlacement.show();
}

type ToastFunction = (title?: string, message?: string, icon?: string, position?: string) => void

// Parent function
export const ToastFunctions: {
    primary: ToastFunction,
    secondary: ToastFunction,
    success: ToastFunction,
    danger: ToastFunction,
    warning: ToastFunction,
    info: ToastFunction,
    dark: ToastFunction,
} = {
    primary(title, message, icon, position) {
        bootstrapToast("bg-primary", title, message, icon, position);
    },
    secondary(title, message, icon, position) {
        bootstrapToast("bg-secondary", title, message, icon, position);
    },
    success(title, message, icon, position) {
        bootstrapToast("bg-success", title, message, icon, position);
    },
    danger(title, message, icon, position) {
        bootstrapToast("bg-danger", title, message, icon, position);
    },
    warning(title, message, icon, position) {
        bootstrapToast("bg-warning", title, message, icon, position);
    },
    info(title, message, icon, position) {
        bootstrapToast("bg-info", title, message, icon, position);
    },
    dark(title, message, icon, position) {
        bootstrapToast("bg-dark", title, message, icon, position);
    },
};