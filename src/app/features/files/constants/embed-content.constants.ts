export const embedDynamicJs = `
  <style>
    .embed-responsive {
      position: relative;
      height: 100%;
    }
    .embed-responsive iframe {
      position: absolute;
      height: 100%;
    }
  </style>
  <link href="https://mfr.osf.io/static/css/mfr.css" media="all" rel="stylesheet">
  <div id="mfrIframe" class="mfr mfr-file"></div>
  <script src="https://mfr.osf.io/static/js/mfr.js"></script>
  <script>
    function renderMfr() {
      var mfrRender = new mfr.Render("mfrIframe", "https://mfr.osf.io/render?url=ENCODED_URL");
    }
    if (window.$) {
      renderMfr();
    } else {
      var jq = document.createElement('script');
      document.head.appendChild(jq);
      jq.onload = function() {
        renderMfr();
      }
      jq.src = 'http://code.jquery.com/jquery-1.11.2.min.js';
    }
  </script>
`.trim();

export const embedStaticHtml = `
<iframe src="ENCODED_URL"
        width="100%"
        scrolling="yes"
        height="677px"
        marginheight="0"
        frameborder="0"
        allowfullscreen
        webkitallowfullscreen
>
`;
