import { compile } from 'ejs';
import { FontelloConfig } from './fontello.js';

const DEMO_HTML_TEMPLATE = `
<html>

  <head>
    <style>
      @font-face {
        font-family: "<%= font.fontFace %>";
        src: url("<%= font.fontPath %>");
      }

      * {
        font-family: "<%= font.fontFace %>"
      }

      .single-icon {
        font-size: 2em;
      }

      .container {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 20px;
      }

       <% glyphs.forEach((function(glyph){%>
          .single-icon.<%= glyph.css%>::before {
            content: "\\<%= glyph.code.toString(16) %>"
          }
       <%}))%>
       
    </style>
  </head>

  <body>
    <div class="container">
      <% glyphs.forEach((function(glyph){%>
        <div class="single-icon <%= glyph.css %>"></div>
      <%})) %>
    </div>
  </body>

</html>
`;

export const createDemoHTML = (config: FontelloConfig, fontPath: string) => {
	const htmlTemplate = compile(DEMO_HTML_TEMPLATE);

	return htmlTemplate({
		font: {
			fontFace: config.name,
			fontPath,
		},
		glyphs: config.glyphs,
	});
};
