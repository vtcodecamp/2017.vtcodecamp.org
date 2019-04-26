module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/media");


    eleventyConfig.addFilter("to12hourTime", function(timeString) { 
        let date = new Date(timeString);
        let time = date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
        })
        return time;
    });



    return {
        dir: {
            input: "src",
        },
        passthroughFileCopy: true,
    };
};
