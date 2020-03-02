function doGet(e) {
    e = {"parameter": {}};
    const domains = ['www.slideshare.net', 'speakerdeck.com', 'docs.google.com/presentation'];
    const httpsDomains = domains.map((domain) => {
        return 'https://' + domain;
    });
    const consumerApiKey = PropertiesService.getScriptProperties().getProperty('CONSUMER_API_KEY');
    const consumerApiSecretKey = PropertiesService.getScriptProperties().getProperty('CONSUMER_API_SECRET_KEY');
    if (consumerApiKey === undefined || consumerApiSecretKey === undefined) {
        throw Error('Not set the CONSUMER_API_KEY or CONSUMER_API_SECRET_KEY');
    }
    const twitter = new Twitter(consumerApiKey, consumerApiSecretKey, domains);
    const archive = new Archive(new RegExp('^' + httpsDomains.join('|')));
    const controller = new Controller(twitter, archive);
    const params = controller.parseParams(e);
    controller.twitter.keyword = params.keyword;
    controller.twitter.since = params.since;
    controller.twitter.until = params.until;
    const result = controller.run();
    ContentService.createTextOutput();
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify(result));
    return output
}