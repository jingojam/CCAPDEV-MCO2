document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save-button");
  const cancelButton = document.getElementById("cancel-button");

  // Extract values from dropdowns
  function getFormData() {
    return {
      date: document.getElementById("detail-date").value,
      timeStart: document.getElementById("detail-time-start").value,
      timeEnd: document.getElementById("detail-time-end").value,
      lab: document.getElementById("detail-lab").value,
      seat: document.getElementById("detail-seat").value
    };
  }

  saveButton.addEventListener("click", () => {
    Swal.fire({
      title: 'Save changes?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = getFormData();

        fetch('/res_edit/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(response => {
          Swal.fire('Saved!', response.message, 'success').then(() => {
            window.location.href = '/view';
          });
        });
      }
    });
  });

  cancelButton.addEventListener("click", () => {
    Swal.fire({
      title: 'Delete reservation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = getFormData();

        fetch('/res_edit/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(response => {
          Swal.fire('Deleted!', response.message, 'success').then(() => {
            window.location.href = '/view';
          });
        });
      }
    });
  });
});
