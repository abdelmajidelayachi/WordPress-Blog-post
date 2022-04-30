jQuery(document).ready(function ($) {
  // Only show the "remove image" button when needed
  var thumbnail_id = jQuery("#post_cat_thumbnail_id");
  if (!thumbnail_id.val() || "0" === thumbnail_id.val()) {
    jQuery(".remove_image_button").hide();
  }

  // Uploading files
  var file_frame;

  jQuery(document).on("click", ".upload_image_button", function (event) {
    event.preventDefault();

    // If the media frame already exists, reopen it.
    if (file_frame) {
      file_frame.open();
      return;
    }

    // Create the media frame.
    file_frame = wp.media.frames.downloadable_file = wp.media({
      title: beAdmin.title,
      button: {
        text: beAdmin.btn_txt,
      },
      multiple: false,
    });

    // When an image is selected, run a callback.
    file_frame.on("select", function () {
      var attachment = file_frame.state().get("selection").first().toJSON();
      var attachment_thumbnail =
        attachment.sizes.thumbnail || attachment.sizes.full;

      jQuery("#post_cat_thumbnail_id").val(attachment.id);
      jQuery("#post_cat_thumbnail")
        .find("img")
        .attr("src", attachment_thumbnail.url);
      jQuery(".remove_image_button").show();
    });

    // Finally, open the modal.
    file_frame.open();
  });

  jQuery(document).on("click", ".remove_image_button", function () {
    jQuery("#post_cat_thumbnail").find("img").attr("src", beAdmin.img);
    jQuery("#post_cat_thumbnail_id").val("");
    jQuery(".remove_image_button").hide();
    return false;
  });

  jQuery(document).ajaxComplete(function (event, request, options) {
    if (
      request &&
      4 === request.readyState &&
      200 === request.status &&
      options.data &&
      0 <= options.data.indexOf("action=add-tag")
    ) {
      var res = wpAjax.parseAjaxResponse(request.responseXML, "ajax-response");
      if (!res || res.errors) {
        return;
      }
      // Clear Thumbnail fields on submit
      jQuery("#post_cat_thumbnail").find("img").attr("src", beAdmin.img);
      jQuery("#post_cat_thumbnail_id").val("");
      jQuery(".remove_image_button").hide();
      return;
    }
  });

  jQuery(".colorpicker").wpColorPicker();
});
