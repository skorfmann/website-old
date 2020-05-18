const htmlmin = require("html-minifier")
const embeds = require("eleventy-plugin-embed-everything");
const excerpt = require('eleventy-plugin-excerpt');
const outdent = require('outdent')

module.exports = eleventyConfig => {
    eleventyConfig.addPlugin(embeds);
    eleventyConfig.addPlugin(excerpt);
    eleventyConfig.addNunjucksShortcode("twitter", function(tweetId) {
        const domId = `tweet-${tweetId}`
        return `
<div class="flex lg:justify-center">
<div id="${domId}" tweetID="${tweetId}"></div>
</div>
<script>
    window.twttr.ready(function() {
    var tweet = document.getElementById("${domId}");
    var id = tweet.getAttribute("tweetID");
    twttr.widgets.createTweet(
        id, tweet,
        {
        conversation : 'none',    // or all
        cards        : 'visible',  // or visible
        linkColor    : '#cc0000', // default is blue
        theme        : 'light'    // or dark
        })
    });

</script>
`
    });

    eleventyConfig.addFilter("jsonTitle", (str) => {
        return str.replace(/"(.*)"/g, '\\"$1\\"');
      });

    eleventyConfig.addShortcode("gist", function(url, file) {
        if (file) {
            return outdent`<script src="${url}.js?file=${file}"></script>`
        } else {
            return outdent`<script src="${url}.js"></script>`
        }
    })

    eleventyConfig.addShortcode("github", function(slug) {
        return outdent`
            <div class="flex items-center justify-center mb-4 py-3 rounded">
                <svg fill="currentColor" role="img" aria-hidden="true" width="50" height="50">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/images/icons/icon-library.svg#icon-github"></use>
                </svg>
                <a class="text-2xl font-medium" href="https://www.github.com/${slug}" target="_blank">${slug}</a>
            </div>`
    })

    // Add a readable date formatter filter to Nunjucks
    eleventyConfig.addFilter("dateDisplay", require("./filters/dates.js"))

    // Add a HTML timestamp formatter filter to Nunjucks
    eleventyConfig.addFilter("htmlDateDisplay", require("./filters/timestamp.js"))

    // Minify our HTML
    eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
        if ( outputPath.endsWith(".html") )
        {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            })
            return minified
        }
        return content
    })

    // Collections
    eleventyConfig.addCollection('blog', collection => {

        const blogs = collection.getFilteredByTag('blog')

        for( let i = 0; i < blogs.length; i++ ) {

            const prevPost = blogs[i - 1]
            const nextPost = blogs[i + 1]

            blogs[i].data["prevPost"] = prevPost
            blogs[i].data["nextPost"] = nextPost

        }

        return blogs.reverse()

    })

    // Layout aliases
    eleventyConfig.addLayoutAlias('default', 'layouts/default.njk')
    eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')

    // Include our static assets
    eleventyConfig.addPassthroughCopy("css")
    eleventyConfig.addPassthroughCopy("js")
    eleventyConfig.addPassthroughCopy("images")
    eleventyConfig.addPassthroughCopy("robots.txt")

    return {
        templateFormats: ["md", "njk"],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        passthroughFileCopy: true,

        dir: {
            input: 'site',
            output: 'dist',
            includes: 'includes',
            data: 'globals'
        }
    }

}
