/// <reference types="chrome"/>
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        settings: {
            showCheckmarks: 'always',
            betaEnabled: false,
            overdueCollapsed: false, //when true, overdue section is collapsed
        },
        courses: [] //array of courses with checked asgmts
    });
    inspectData();
    function inspectData() {
        setInterval(() => {
            chrome.storage.sync.get(null, (data) => {
                console.log(data);
            });
        }, 3000);
    }
});
//also onMessage in SchoologyPage.js
chrome.runtime.onMessage.addListener((message, sender, sendRes) => {
    console.log({ message, sender });
    const data = JSON.parse(message.data);
    if (message.run === 'update chrome storage') {
        chrome.storage.sync.set(data, () => {
            console.log('Updated successfully key-value:', data);
            return true;
        });
    }
    return true;
});
chrome.runtime.onUpdateAvailable.addListener(details => {
    console.log({ details });
    chrome.tabs.create({
        url: 'onboarding/updated.html'
    });
    chrome.runtime.reload();
});
/*
Schema:
{
    settings: {...},
    courses: [
        { //course
            name: 'English II: ENG II - B1',
            noSpacesName: 'EnglishII:ENGII-B1', //for different calendar & home course names
            checked: ['read macbeth', 'study for grammar quiz'], //asgmts
        }
    ]
}
*/ 
