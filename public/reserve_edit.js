document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save-button");
  const cancelButton = document.getElementById("cancel-button");

  function getFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      timeStart: document.getElementById("detail-time-start").value,
      timeEnd: document.getElementById("detail-time-end").value,
      seat: document.getElementById("detail-seat").value,
      baseId: urlParams.get("baseId"),
      userId: urlParams.get("userId"),
      reservationId: document.getElementById("reservation-id")?.value || null
    };
  }

  saveButton.addEventListener("click", (event) => {
    event.preventDefault();

    Swal.fire({
      title: 'Save changes?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = getFormData();

        fetch(window.location.pathname + window.location.search, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            const errorParagraph = document.querySelector('#reservation-details-container p.error-message');
            if (errorParagraph) {
              errorParagraph.textContent = data.message;
              errorParagraph.style.display = 'block';
            }
          } else {
            Swal.fire('Saved!', data.message, 'success').then(() => {
              const userId = formData.userId;
              const baseId = formData.baseId;
              window.location.href = `/view?userId=${userId}&baseId=${baseId}`;
            });
          }
        })
        .catch(err => {
          console.error(err);
          Swal.fire('Error!', 'Something went wrong.', 'error');
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
        const reservationId = document.getElementById('reservation-id').value;
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const baseId = urlParams.get('baseId');

        fetch(`/res_edit/${reservationId}/delete?userId=${userId}&baseId=${baseId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(response => {
          Swal.fire('Deleted!', response.message, 'success').then(() => {
            window.location.href = `/view?userId=${userId}&baseId=${baseId}`;
          });
        })
        .catch(err => {
          console.error(err);
          Swal.fire('Error!', 'Something went wrong.', 'error');
        });
      }
    });
  });
});
