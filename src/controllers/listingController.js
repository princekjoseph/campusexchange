const { pool } = require('../config/db');
const { uploadFile } = require('../config/s3');

// 1. Browse & Search Listings
exports.getAllListings = async (req, res) => {
  const { category, type, search } = req.query;

  let query = `
    SELECT l.*, u.name as seller_name, u.college as seller_college 
    FROM listings l 
    JOIN users u ON l.user_id = u.id 
    WHERE l.status = 'ACTIVE'
  `;
  const params = [];

  if (category) {
    params.push(category);
    query += ` AND l.category = $${params.length}`;
  }

  if (type) {
    params.push(type);
    query += ` AND l.listing_type = $${params.length}`;
  }

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (l.title ILIKE $${params.length} OR l.description ILIKE $${params.length})`;
  }

  query += ` ORDER BY l.created_at DESC`;

  try {
    const result = await pool.query(query, params);
    res.render('pages/listings', {
      listings: result.rows,
      filters: { category, type, search }
    });
  } catch (err) {
    console.error('Failed to fetch listings:', err.message);
    res.render('pages/listings', { listings: [], filters: {} });
  }
};

// 2. Render Post Form
exports.getNewListing = (req, res) => {
  res.render('pages/new-listing', { error: null });
};

// 3. Handle Item Creation
exports.postNewListing = async (req, res) => {
  const { title, category, listing_type, price, exchange_for, condition, description, location } = req.body;
  const userId = req.user.id;

  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFile(req.file);
    }

    await pool.query(
      `INSERT INTO listings (user_id, title, category, listing_type, price, exchange_for, condition, description, location, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        userId,
        title,
        category,
        listing_type,
        listing_type === 'SELL' ? parseFloat(price) || 0 : 0,
        listing_type === 'EXCHANGE' ? exchange_for : null,
        condition,
        description,
        location,
        imageUrl
      ]
    );

    res.redirect('/listings');
  } catch (err) {
    console.error(err);
    res.render('pages/new-listing', { error: 'Failed to create listing. Ensure all fields are valid.' });
  }
};

// 4. View Single Listing
exports.getListingById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT l.*, u.name as seller_name, u.college as seller_college, u.department as seller_dept, u.year as seller_year, u.phone as seller_phone
       FROM listings l
       JOIN users u ON l.user_id = u.id
       WHERE l.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Listing not found');
    }

    res.render('pages/listing-detail', { listing: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// 5. User Dashboard
exports.getDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM listings WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    const listings = result.rows;
    const stats = {
      total: listings.length,
      active: listings.filter(l => l.status === 'ACTIVE').length,
      sold: listings.filter(l => l.status === 'SOLD').length,
      given: listings.filter(l => l.status === 'GIVEN_AWAY').length,
    };

    res.render('pages/dashboard', { listings, stats });
  } catch (err) {
    console.error(err);
    res.render('pages/dashboard', { listings: [], stats: { total: 0, active: 0, sold: 0, given: 0 } });
  }
};

// 6. Update Listing Status or Delete
exports.updateListingStatus = async (req, res) => {
  const { id } = req.params;
  const { status, action } = req.body;
  const userId = req.user.id;

  try {
    if (action === 'delete') {
      await pool.query('DELETE FROM listings WHERE id = $1 AND user_id = $2', [id, userId]);
    } else if (['ACTIVE', 'SOLD', 'GIVEN_AWAY'].includes(status)) {
      await pool.query('UPDATE listings SET status = $1 WHERE id = $2 AND user_id = $3', [status, id, userId]);
    }
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};