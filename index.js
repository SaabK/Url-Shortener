const express = require('express');
const mongoose = require('mongoose');
const ShortUrls = require('./models/shortUrls');
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/urlShortener');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
	const shortUrls = await ShortUrls.find();

	res.render('index', { shortUrls });
});

app.post('/shortUrls', async (req, res) => {
	const { fullUrl } = req.body;

	await ShortUrls.create({ full: fullUrl });
	res.redirect('/');
});

app.get('/:shortUrls', async (req, res) => {
	const { shortUrls } = req.params;
	const thatOneUrl = await ShortUrls.findOne({ short: shortUrls });
	console.log(thatOneUrl);
	if (thatOneUrl == null)
		return res.status(404).json({ error: 'No such url exisits' });

	thatOneUrl.clicks++;
	thatOneUrl.save();

	res.redirect(thatOneUrl.full);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
