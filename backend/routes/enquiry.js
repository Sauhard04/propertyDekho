const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,
  logger: true
});

// Handle property enquiry
router.post('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { name, email, phone, message } = req.body;

    console.log('Received enquiry:', { propertyId, name, email });

    // Get property and owner details
    const property = await Property.findById(propertyId).populate('owner');
    
    if (!property) {
      console.error('Property not found:', propertyId);
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!property.owner || !property.owner.email) {
      console.error('Property owner email not found for property:', propertyId);
      return res.status(400).json({ message: 'Property owner email not found' });
    }

    console.log('Sending email to owner:', property.owner.email);

    // Send email to property owner
    const mailOptions = {
      from: `"${name} (via PropertyDeal)" <${process.env.EMAIL_USER}>`,
      to: property.owner.email,
      replyTo: email,
      subject: `New Enquiry for ${property.title}`,
      html: `
        <h2>New Property Enquiry</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Phone:</strong> ${phone}</p>
        
        <h3>Property Details:</h3>
        <p><strong>Title:</strong> ${property.title}</p>
        <p><strong>Location:</strong> ${property.location}</p>
        <p><strong>Price:</strong> ₹${property.price?.toLocaleString()}</p>
        <p><strong>Reference ID:</strong> ${property._id}</p>
        
        <h3>Message:</h3>
        <p>${message}</p>
        
        <p>---</p>
        <p>This enquiry was sent through PropertyDeal. Please reply directly to ${name} using the email above.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Enquiry email sent successfully');
    
    res.json({ message: 'Enquiry sent successfully' });
  } catch (error) {
    console.error('Error sending enquiry:', {
      message: error.message,
      stack: error.stack,
      env: {
        emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    });
    res.status(500).json({ 
      message: 'Failed to send enquiry', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;