const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth'); // Assuming you have authentication middleware
const multer = require('multer');
const path = require('path');
const User = require('../models/User')

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/', // Ensure this directory exists
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // for example, limit file size to 10MB
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('audioFile'); // 'audioFile' is the name attribute in your form

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /wav|mp3/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type - simplifying to directly check for known types
  const mimetype = file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Audio Files Only!');
  }
}



// POST /api/events/newEvent - Create a new event with file upload
router.post('/newEvent', auth, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // Handle error from multer (e.g., file too large)
            return res.status(400).json({ msg: err });
        } else {
            // Check if a file is uploaded
            if (!req.file) {
                return res.status(400).json({ msg: 'No audio file uploaded' });
            }

            // Now handle the other form data for event creation
            const { title, tags, description } = req.body;
            if (!title || !description) {
                // Ensuring required fields are present
                return res.status(400).json({ msg: 'Title and description are required' });
            }

            try {
                const processedTags = Array.isArray(tags) ? tags : []; // Adjusted for direct array handling

                const newEvent = new Event({
                    title,
                    tags: processedTags, // Use tags directly as they are already expected to be an array
                    description,
                    audioFilePath: req.file.path, // Use the file path saved by multer
                    createdBy: req.user.id, // Assuming your auth middleware adds `user` to `req`
                });

                const savedEvent = await newEvent.save();
                res.status(201).json(savedEvent);
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
        }
    });
});


// GET /api/events - Fetch events with optional filtering
router.get('/', auth, async (req, res) => {
  const { title, tags, author, date, page = 1, limit = 30 } = req.query;
  const skipIndex = (page - 1) * limit;

  try {
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (author) {
      const user = await User.findOne({ username: author }).exec();
      if (user) {
        query.createdBy = user._id;
      } else {
        return res.json([]);
      }
    }

    if (date) {
      query.createdAt = { $gte: new Date(date) };
    }

    const count = await Event.countDocuments(query);

    const events = await Event.find(query)
      .populate('createdBy', 'username')
      .populate('comments.postedBy', 'username') // Populate the commenter's username
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skipIndex)
      .exec();

    res.json({ data: events, count });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST /api/events/:eventId/comments - Add a comment to an event
router.post('/:eventId/newComment', auth, async (req, res) => {
  const { eventId } = req.params;
  const { text } = req.body; // Assuming comment text is sent in the request body

  try {
      const event = await Event.findById(eventId);
      if (!event) {
          return res.status(404).json({ msg: 'Event not found' });
      }

      const comment = {
          text,
          postedBy: req.user.id, // Assuming your auth middleware adds `user` to `req`
      };

      event.comments.push(comment);
      await event.save();

      res.status(201).json(event);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});


// GET /api/events/:eventId - Fetch a single event by its ID
router.get('/:eventId', auth, async (req, res) => {
  const { eventId } = req.params;

  try {
      const event = await Event.findById(eventId)
          .populate('createdBy', 'username') // Assuming you want to include the username of the creator
          .populate('comments.postedBy', 'username'); // Populate the username of each commenter

      if (!event) {
          return res.status(404).json({ msg: 'Event not found' });
      }

      res.json(event);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});


module.exports = router;
