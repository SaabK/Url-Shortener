const express = require('express');
const shortid = require('shortid');
const app = express();
const port = process.env.PORT || 5000;
const shortUrls = [];

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
	res.render('index', { shortUrls });
});

app.post('/shortUrls', async (req, res) => {
	const { fullUrl } = req.body;

	if (fullUrl == '') return res.redirect('/');

	const newShortUrl = {
		full: fullUrl,
		short: shortid.generate(),
		clicks: 0,
	};

	shortUrls.push(newShortUrl);

	res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
	const { shortUrl } = req.params;

	const thatOneUrl = shortUrls.find((url) => url.short == shortUrl);

	if (thatOneUrl == null)
		return res.status(404).json({ error: 'No such url exisits' });

	shortUrls.map((url) => {
		if (url.short == shortUrl) {
			return {
				...url,
				clicks: (url.clicks += 1),
			};
		}
	});

	res.redirect(thatOneUrl.full);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
