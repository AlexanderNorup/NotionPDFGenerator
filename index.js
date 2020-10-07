const puppeteer = require('puppeteer');
const fs = require('fs');
const PDFMerger = require('pdf-merger-js');
const util = require('util');
const readdir = util.promisify(fs.readdir);

const url = 'file:///C:/PATH/TO/THE/EXPORTED/HTML/FILE.html';



let depth = 1;
let printed = [];
const printPdf = async (url) => {
    console.log('Generating PDF for: ' + url);

	if(depth >= 100){
		//Failsafe
		return;
	}

    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();

    page.setViewport({
        width: 1920,
        height: 1080
    });

    await page.goto(url, {
        waitUntil: 'networkidle2'
    });

	const hrefs = await page.$$eval('a', as => as.map(a => a.href));
	for(let href of hrefs){
		if(href.indexOf("file://") == 0){
			
			if(printed.indexOf(href) != -1){
				console.log("Already visited " + href + "! Skipping...");
				continue;
			}
			
			printed.push(href);
			
			let newUrl = href;
			let extensionSplit = newUrl.split(".");
			if(extensionSplit[1].trim() != "html"){
				continue;
			}
			
			let thisDepth = depth;
			depth++;
			
			
			const newBuff = await(printPdf(newUrl));
			writeBufferToFile(newBuff, thisDepth+".pdf");

		}
	}


    const pdfFile = await page.pdf({
        format: 'A4',
        printBackground: true,
		displayHeaderFooter: true,
		footerTemplate: " "
    });

    await browser.close();

    return pdfFile;
};

function writeBufferToFile(buffer, file){
	fs.writeFile("./out/"+file, buffer,  "binary",function(err) { console.error(err); });
}



async function mergeAllPDF(){
	console.log("Merging PDF");
	let merger = new PDFMerger();


	files = await readdir("./out");
	
	files.forEach(function (file) {
		console.log("Adding " + file + " to merge");
		merger.add('./out/'+file);  //merge all pages. parameter is the path to file and filename.
	});

	await merger.save('Export.pdf'); //save under given name
	
	console.log("PDF Saved!");
	console.log("Cleanup started");
	files.forEach(function (file) {
		console.log("Deleting " + file + "!");
		fs.unlinkSync("./out/"+file);
	});

}

(async() => {
    const buffer = await printPdf(url);
	writeBufferToFile(buffer, "0.pdf");
	
	await mergeAllPDF();
	
})();