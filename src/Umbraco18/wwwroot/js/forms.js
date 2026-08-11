function updateDataConsentTextField(obj) {
  const hidden = document.getElementById('DataConsentText');
  if (!hidden) return;

  hidden.value = obj.checked ? "true" : "";
  //console.debug(hidden.value);
  const form = obj.closest("form");
  if (form) {
    $(form).validate().element("#DataConsentText");
  }
}
(function () {
  const submitBtn = document.getElementById('form-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const form = submitBtn.closest('form');
      if (!form) return;

      const form$ = $(form);
      if (form$.valid()) {
        submitBtn.setAttribute('disabled', true);
        let label = submitBtn.innerText;
        label += '...';
        submitBtn.innerText = label;
        form$.submit();
      }
    });
  }
})()
