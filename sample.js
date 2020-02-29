function doGet(e) {
    var c = new Controller();
    var result = c.run(e);
    ContentService.createTextOutput();
    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify(result));
    return output
}