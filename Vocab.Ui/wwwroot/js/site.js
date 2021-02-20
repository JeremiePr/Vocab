function initializeModals(modalSelectors) {
    console.log(modalSelectors);
    for (const modalSelector of modalSelectors) {
        $(modalSelector).modal();
    }
}

function openModal(modalSelector) {
    $(modalSelector).modal("open");
}