# Notion PDF Generator
Generates PDF's from [Notion](https://www.notion.so/)'s HTML-export.

Normally exporting PDF's from Notion that **include subpages** is a enterprice-only feature. Notion does however allow for exporting of HTML pages including subpages for all users.
This very very primitive node-script allows for converting that HTML-export to a combined PDF.
The script uses [Puppeteer](https://github.com/puppeteer/puppeteer) to run a head-less chrome browser, and then using that chrome browsers "print-to-pdf" feature. Doing it this way, ensures that the generated PDF will be as accurate as possible.

The script works like this. 
You make an HTML export from Notion that includes subpages. You'll get a ZIP file you can extract somewhere on your PC.
In the export, there will be a HTML file and some folders that contain the subpages. You then open the HTML file in your browser and copy the `file://` url to that file and pass it to the script.
The script will then look through that file. If it finds any links to subpages, it will then open them and to the same thing there.
In the end it will make 1 PDF containing all the referenced pages. 
That means, even if you include subpages in your HTML export, the script will only actually find those subpages, if you link to them from the main-page. Did I say this script was primitive?
It works for my note-keeping system, but feel free to submit a pull request that makes it work even if you don't reference the subpages.

## Installation
0. Make sure you have node and npm available on your system: https://nodejs.org/en/ 
1. Download the repo: https://github.com/AlexanderNorup/NotionPDFGenerator/archive/master.zip
2. Extract the zip somewhere on your PC
3. Navigate to the folder, and run `npm install` in the command-line
4. Open the `index.js`, and change the `url` variable so it points to your exported HTML file
5. Run `node index.js`
6. Enjoy the `Export.pdf` file now found in the root project.
