const ShortUniqueId = require("short-unique-id");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    //console.log(`body:${body}`);
    // Validate that the URL is provided
    if (!body.url) {
        return res.status(400).json({ error: "URL is required" });
    }

    // Create an instance of ShortUniqueId
    const uid = new ShortUniqueId();

    // Generate a short unique ID of length 8
    const shortID = uid.rnd();

    // Save the new URL with the generated short ID in the database
    try {
        await URL.create({
            shortID: shortID,
            redirectURL: body.url,
            visitHistory: [],
            createdBy:req.user._id
        });

        // Respond with the generated short ID
        //return res.json({ id: shortID });
        return res.render("home",{ id: shortID })
    } catch (error) {
        // Handle any errors that occur during database operation
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function handleGetAnalytics(req, res) {
    const shortID = req.params.shortID;
    console.log(shortID);
    const result = await URL.findOne({ shortID });
    console.log(result);
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics };
