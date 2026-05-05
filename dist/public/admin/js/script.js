// upload-image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End upload-image

// upload-audio
const uploadAudio = document.querySelector("[upload-audio]");
if (uploadAudio) {
  const uploadAudioInput = uploadAudio.querySelector("[upload-audio-input]");
  const uploadAudioPlay = uploadAudio.querySelector("[upload-audio-play]");
  const uploadAudioSource = uploadAudioPlay.querySelector("source");

  uploadAudioInput.addEventListener("change", () => {
    const file = uploadAudioInput.files[0];
    if (file) {
      uploadAudioSource.src = URL.createObjectURL(file);
      uploadAudioPlay.load();
    }
  });
}
// End upload-audio

// Delete item
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
  listButtonDelete.forEach((button) => {
    button.addEventListener("click", async () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa mục này không?");

      if (!isConfirm) {
        return;
      }

      const id = button.getAttribute("data-id");
      const deleteUrl =
        button.getAttribute("data-delete-url") || `/admin/topics/delete/${id}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.code === 200) {
        window.location.reload();
      } else {
        alert("Xóa không thành công!");
      }
    });
  });
}
// End delete item
