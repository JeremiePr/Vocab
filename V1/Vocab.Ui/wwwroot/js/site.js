function initializeModals(modalSelectors) {
    for (const modalSelector of modalSelectors) {
        $(modalSelector).modal();
    }
}

function initializeDropdowns(dropdownSelectors) {
    for (const dropdownSelector of dropdownSelectors) {
        $(dropdownSelector).formSelect();
    }
}

function openModal(modalSelector) {
    $(modalSelector).modal("open");
}

function focusElement(elementSelector) {
    setTimeout(() => $(elementSelector).focus(), 1);
}

function scrollTop(selector) {
    $(selector).scrollTop(0);
}